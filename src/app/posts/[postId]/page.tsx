import { getPostData, getSortedPostsData } from '@/lib/posts'
import React from 'react'
import { notFound } from 'next/navigation';
import getFormattedDate from '@/lib/getFormattedDate';
import Link from 'next/link';

export function generateStaticParams() {
    const posts = getSortedPostsData(); // request will be deduped = eliminae unnecessary copies
    return posts.map((post) => {
        postId: post.id
    })
}

//Dynamic Metadata for a dynamic page
export function generateMetadata({params}: {params: {postId: string}}){
    const posts = getSortedPostsData(); // request will be deduped = eliminae unnecessary copies
    const { postId } = params;
    const post = posts.find((post) => post.id === postId );

    //Metadata not found
    if(!post){
        return {
            title: 'Post Not Found'
        }
    }
    //dynamic metadata object
    return {
        title: post.title,
    }
}

const Post = async ({ params }:{ params: {postId: string}}) => {
    const posts = getSortedPostsData(); // request will be deduped = eliminae unnecessary copies
    const { postId } = params;

    if(!posts.find((post) => post.id === postId )){
        return notFound();
    }
    const {title, date,contentHtml} = await getPostData(postId)
    const pubDate = getFormattedDate(date);
    return (
    <main className='px-6 prose prose-xl prose-slate dark:prose-invert mx-auto'>
        <h1 className='text-3xl mt-4 mb-0'>{title}</h1>
        <p className='mt-0'>
            {pubDate}
        </p>
        <article>
            <section dangerouslySetInnerHTML={{__html: contentHtml}}/>
            <p>
                <Link href={"/"}>{"<-"}Back to home</Link>
            </p>
        </article>
    </main>
  )
}

export default Post;