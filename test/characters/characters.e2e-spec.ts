import * as request from 'supertest';
import { app, prisma } from '../common/setup';

const clearDb = async () => {
  await prisma.characterEpisode.deleteMany();
  await prisma.character.deleteMany();
  await prisma.episode.deleteMany();
  await prisma.planet.deleteMany();
};

describe('Characters CRUD (e2e)', () => {
  let planet;
  let episodes;

  beforeEach(async () => {
    await clearDb();

    planet = await prisma.planet.create({ data: { name: 'Tatooine' } });
    episodes = await Promise.all([
      prisma.episode.create({ data: { name: 'NEWHOPE' } }),
      prisma.episode.create({ data: { name: 'EMPIRE' } }),
    ]);
  });

  afterAll(async () => {
    await clearDb();
  });

  it('should create a character with episodes', async () => {
    const mutation = `
      mutation {
        createCharacter(input: {
          name: "Luke Skywalker",
          planetId: ${planet.id},
          episodeIds: [${episodes[0].id}, ${episodes[1].id}]
        }) {
          id
          name
          planet {
            id
            name
          }
          episodes {
            id
            name
          }
        }
      }
    `;
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation });

    expect(response.status).toBe(200);
    expect(response.body.data.createCharacter.name).toBe('Luke Skywalker');
    expect(response.body.data.createCharacter.planet.name).toBe('Tatooine');
    expect(response.body.data.createCharacter.episodes).toHaveLength(2);
    expect(response.body.data.createCharacter.episodes[0].name).toBe('NEWHOPE');
    expect(response.body.data.createCharacter.episodes[1].name).toBe('EMPIRE');
  });

  it('should get a character by id with episodes', async () => {
    const character = await prisma.character.create({
      data: {
        name: 'Luke Skywalker',
        planetId: planet.id,
        episodes: {
          create: [
            { episodeId: episodes[0].id },
            { episodeId: episodes[1].id },
          ],
        },
      },
      include: { episodes: { include: { episode: true } }, planet: true },
    });

    const query = `
      query {
        character(id: ${character.id}) {
          id
          name
          planet {
            id
            name
          }
          episodes {
            id
            name
          }
        }
      }
    `;
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query });

    expect(response.status).toBe(200);
    expect(response.body.data.character.name).toBe('Luke Skywalker');
    expect(response.body.data.character.planet.name).toBe('Tatooine');
    expect(response.body.data.character.episodes).toHaveLength(2);
    expect(response.body.data.character.episodes[0].name).toBe('NEWHOPE');
    expect(response.body.data.character.episodes[1].name).toBe('EMPIRE');
  });

  it('should update a character', async () => {
    const character = await prisma.character.create({
      data: {
        name: 'Luke Skywalker',
        planetId: planet.id,
        episodes: {
          create: [
            { episodeId: episodes[0].id },
            { episodeId: episodes[1].id },
          ],
        },
      },
      include: { episodes: { include: { episode: true } }, planet: true },
    });

    const mutation = `
      mutation {
        updateCharacter(id: ${character.id}, input: { name: "Luke Skywalker Updated" }) {
          id
          name
        }
      }
    `;
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation });

    expect(response.status).toBe(200);
    expect(response.body.data.updateCharacter.name).toBe(
      'Luke Skywalker Updated',
    );
  });

  it('should delete a character', async () => {
    const character = await prisma.character.create({
      data: {
        name: 'Luke Skywalker',
        planetId: planet.id,
        episodes: {
          create: [
            { episodeId: episodes[0].id },
            { episodeId: episodes[1].id },
          ],
        },
      },
      include: { episodes: { include: { episode: true } }, planet: true },
    });

    const mutation = `
      mutation {
        deleteCharacter(id: ${character.id}) {
          id
          name
        }
      }
    `;
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation });

    expect(response.status).toBe(200);
    expect(response.body.data.deleteCharacter.name).toBe('Luke Skywalker');
  });
});
