const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');

const {
  userOne,
  userOneId,
  setupDatabase,
  userTwo,
  userTwoId,
  taskOne
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create task from user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'From my test',
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test('Should get all user one tasks', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toBe(2);
});

test('Should not delete other users tasks', async () => {
  const response = await request(app)
    .delete(`/task/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

  const task = Task.findById(taskOne._id);
  expect(task).not.toBeNull()
})

test('Should not create task with invalid completed', async () => {
  await request(app)
    .post('/tasks').set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'Testing',
      completed: 'hello'
    })
    .expect(400)
})

test('Should not update task with invalid completed', async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'Update task',
      completed: 'hello'
    })
    .expect(400)
})

test('Should delete user task', async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not delete task if unauthenticated', async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .send()
    .expect(401)
})

test('Should not update other users task', async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
      description: 'Update task',
      completed: true
    })
    .expect(404)
})

test('Should fetch user task by id', async () => {
  await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not fetch user task by id if unauthenticated', async () => {
  await request(app)
    .get(`/tasks/${taskOne._id}`)
    .send()
    .expect(401)
})

test('Should not fetch other users task by id', async () => {
  await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)
})


test('Should fetch only completed tasks', async () => {
  await request(app)
    .get(`/tasks`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      completed: true
    })
    .expect(200)
})

test('Should fetch only incomplete tasks', async () => {
  await request(app)
    .get(`/tasks`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      completed: false
    })
    .expect(200)
})


// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks