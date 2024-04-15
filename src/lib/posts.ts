import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {remark} from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(),'blogposts');

export function getSortedPostsData() {
    //Get File names under posts
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
            //Remove .md from the file name to get id
            const id = fileName.replace(/\.md$/, '');

            //Read markdown file as string
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            //Use gray matter to parse the metadata secton
            const matterResult = matter(fileContents);

            const blogPost: BlogPost = {
                id,
                title: matterResult.data.title,
                date: matterResult.data.date,
            }

            //Combine the data with id
            return blogPost;
        });

        // Sort posts by date
        return allPostsData.sort((a,b) => a.date < b.date ? 1 : -1);
}

export async function getPostData(id: string) {
    const fullPath = path.join(postsDirectory, `${id}`);
    console.log("==================>",fullPath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    //use gray-matter to parse the posr metadata section
    const matterResult = matter(fileContents);

    const processedContent = await remark().use(html).process(matterResult.content);
    const contentHtml = processedContent.toString();

    const blogPostWithHTML: BlogPost & { contentHtml: string} = {
        id,
        title: matterResult.data.title,
        date: matterResult.data.date,
        contentHtml,
    }
    //combine the data with id
    return blogPostWithHTML
}