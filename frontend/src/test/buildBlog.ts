import { Blog, DetailBlog } from "../types/inteface";
import faker from "faker";

function generateBlogs(count: number): Blog[] {
    const blogs: Blog[] = []
    for (let i = 0; i < count; i++) {
        let blog: Blog = {
            id: faker.random.number(),
            title: faker.lorem.word(),
            description: faker.lorem.paragraph(),
            createdAt: faker.date.recent().toString()
        }
        blogs.push(blog);
    }
    return blogs
}

function detailBlog(overrides: any = {}): DetailBlog {
    return {
        author: {
            avatar: faker.internet.url(),
            id: faker.random.number({ min: 1, max: 5 }),
            name: faker.name.findName(),
            username: faker.internet.userName(),
        },
        createdAt: new Date().toISOString(),
        description: faker.lorem.paragraph(),
        id: faker.random.number({ min: 1, max: 5 }),
        title: faker.lorem.words(),
        ...overrides
    }
}

// function generateBlog()

export { generateBlogs, detailBlog }