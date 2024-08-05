import { Card } from "@/components/card";
import { Section } from "@/components/section";
import Blog1 from "../../../../public/blog-1.webp";
import Blog2 from "../../../../public/blog-2.webp";
import Blog3 from "../../../../public/blog-3.webp";
import Blog4 from "../../../../public/blog-4.webp";
import Blog5 from "../../../../public/blog-5.webp";
import Blog6 from "../../../../public/blog-6.webp";
import Blog7 from "../../../../public/blog-7.webp";
import Head from "next/head";

const BlogsData = [
  {
    id: 1,
    title: "Why Short-Term Loan Is Better Than Borrowing Money From Others",
    author: "Nidhi Sharma",
    imageUrl: Blog1,
  },
  {
    id: 2,
    title: "How CIBIL Score Is Essential For Lending",
    author: "Nidhi Sharma",
    imageUrl: Blog2,
  },
  {
    id: 3,
    title: "What Is Digital Lending? 5 Tips To Keep In Mind",
    author: "Nidhi Sharma",
    imageUrl: Blog3,
  },
  {
    id: 4,
    title: "How To Get An Instant Loan Without Any Credit History",
    author: "Nidhi Sharma",
    imageUrl: Blog4,
  },
  {
    id: 5,
    title: "Manage Your Unplanned Charges With An Affordable Loan",
    author: "Nidhi Sharma",
    imageUrl: Blog5,
  },
  {
    id: 6,
    title: "What’s A Good Credit Score For Easy Loan Approval?",
    author: "Nidhi Sharma",
    imageUrl: Blog6,
  },
  {
    id: 7,
    title: "Boost Your Chances For An Instant Loan Approval",
    author: "Nidhi Sharma",
    imageUrl: Blog7,
  },
];

const Blogs = () => (
  <>
    <Head>
      <title>Blogs - Paisaintime</title>
    </Head>
    <Section title="Blogs" styling="pt-28">
      <div className="grid md:grid-cols-3 grid-cols-1 gap-10">
        {BlogsData.map((blog) => (
          <Card
            key={blog.id}
            id={blog.id}
            title={blog.title}
            author={blog.author}
            imageUrl={blog.imageUrl}
          />
        ))}
      </div>
    </Section>
  </>
);

export default Blogs;
