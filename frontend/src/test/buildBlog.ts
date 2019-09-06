import { Blog } from "../types/inteface";
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

// function generateBlog()

export { generateBlogs }