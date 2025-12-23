import prisma from "@/lib/prisma";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import {
    BlogHero,
    BlogCard,
    SearchWidget,
    NewsletterWidget,
    CategoriesWidget,
    TagsWidget,
} from "@/components/blog";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
    const site = await prisma.site.findFirst({
        where: { domain: "renovamente-guiomarmelo.com.br" },
    });

    if (!site) {
        return <div>Site não configurado</div>;
    }

    // Fetch posts
    const posts = await prisma.post.findMany({
        where: {
            siteId: site.id,
            status: "PUBLISHED",
        },
        include: {
            category: true,
            author: true,
        },
        orderBy: { publishedAt: "desc" },
    });

    // Fetch categories with counts
    const categories = await prisma.category.findMany({
        where: {
            siteId: site.id,
        },
        include: {
            _count: {
                select: { posts: true },
            },
        },
    });

    // Derived data
    const featuredPost = posts[0];
    const recentPosts = posts.slice(1);

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-gray-100 min-h-screen flex flex-col transition-colors duration-300">
            <Header />

            {/* Main Content */}
            <div className="layout-container flex grow flex-col w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left Column: Content */}
                    <main className="w-full lg:w-2/3 flex flex-col gap-10">
                        {posts.length > 0 ? (
                            <>
                                <BlogHero post={featuredPost} />

                                {/* Blog Posts Grid */}
                                <section>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-bold text-text-main dark:text-white">
                                            Últimos Artigos
                                        </h3>
                                    </div>
                                    {recentPosts.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {recentPosts.map((post) => (
                                                <BlogCard key={post.id} post={post} />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">
                                            Nenhum outro artigo encontrado.
                                        </p>
                                    )}
                                    {/* Pagination - Placeholder for now */}
                                    <div className="flex justify-center mt-12 gap-2">
                                        {/* Pagination buttons can be implemented here */}
                                    </div>
                                </section>
                            </>
                        ) : (
                            <div className="text-center py-20">
                                <h2 className="text-xl font-bold">
                                    Nenhum post publicado ainda.
                                </h2>
                                <p>Volte em breve para novidades!</p>
                            </div>
                        )}
                    </main>

                    {/* Right Column: Sidebar */}
                    <aside className="w-full lg:w-1/3 flex flex-col gap-8">
                        <SearchWidget />
                        <NewsletterWidget />
                        <CategoriesWidget categories={categories} />
                        <TagsWidget />
                    </aside>
                </div>
            </div>

            <Footer />
        </div>
    );
}
