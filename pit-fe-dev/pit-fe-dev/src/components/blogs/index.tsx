import { Card } from "../card";
import { Section } from "../section";
import Blog1 from "../../../public/blog-1.webp";
import Blog2 from "../../../public/blog-2.webp";
import Blog3 from "../../../public/blog-3.webp";

const BlogsData = [
  {
    id: 1,
    title: "Why Short-Term Loan Is Better Than Borrowing Money From Others",
    author: "Nidhi Sharma",
    imageUrl: Blog1,
  },
  {
    id: 2,
    title: "How CIBIL Score Is Essential For Personal Lending",
    author: "Nidhi Sharma",
    imageUrl: Blog2,
  },
  {
    id: 3,
    title: "What Is Digital Lending? 5 Tips To Keep In Mind",
    author: "Nidhi Sharma",
    imageUrl: Blog3,
  },
];

const Blogs = () => (
  <Section title="Blogs" styling="bg-gray-200">
    <div className="flex md:flex-row flex-col justify-between items-center">
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
);

export { Blogs };
