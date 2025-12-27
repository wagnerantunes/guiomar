import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import {
    SearchWidget,
    NewsletterWidget,
    CategoriesWidget,
    TagsWidget,
} from "@/components/blog";
import { RichText } from "@/components/ui/RichText";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;

    const post = await prisma.post.findFirst({
        where: {
            slug,
            status: "PUBLISHED",
        },
        include: {
            category: true,
            author: true,
            site: true,
        },
    });

    if (!post) {
        return notFound();
    }

    // Increment views
    await prisma.post.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
    });

    // Fetch categories for sidebar
    const categories = await prisma.category.findMany({
        where: {
            siteId: post.siteId,
        },
        include: {
            _count: {
                select: { posts: true },
            },
        },
    });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": post.image || "https://renovamente-guiomarmelo.com.br/og-image.jpg",
        "datePublished": post.publishedAt?.toISOString(),
        "dateModified": post.updatedAt.toISOString(),
        "author": [{
            "@type": "Person",
            "name": post.author.name,
            "url": "https://renovamente-guiomarmelo.com.br"
        }],
        "description": post.excerpt || post.title,
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-gray-100 min-h-screen flex flex-col transition-colors duration-300">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header />

            <div className="layout-container flex grow flex-col w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left Column: Content */}
                    <main className="w-full lg:w-2/3 flex flex-col gap-10">
                        <article className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 bg-white">
                            {/* Breadcrumb / Back Link */}
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-dark mb-8 transition-colors text-sm uppercase tracking-wide"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    arrow_back
                                </span>
                                Voltar para o blog
                            </Link>

                            {/* Header */}
                            <header className="mb-8">
                                {post.category && (
                                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary-dark rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                                        {post.category.name}
                                    </span>
                                )}
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-main dark:text-white mb-6 leading-tight">
                                    {post.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-text-muted dark:text-gray-400 text-sm border-b border-gray-100 dark:border-gray-800 pb-8">
                                    <div className="flex items-center gap-2">
                                        {post.author.image ? (
                                            <div
                                                className="size-8 rounded-full bg-gray-300 bg-cover"
                                                style={{
                                                    backgroundImage: `url("${post.author.image}")`,
                                                }}
                                            />
                                        ) : (
                                            <span className="material-symbols-outlined">person</span>
                                        )}
                                        <span className="font-medium">{post.author.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">
                                            calendar_today
                                        </span>
                                        <span>
                                            {post.publishedAt
                                                ? format(new Date(post.publishedAt), "d 'de' MMM, yyyy", {
                                                    locale: ptBR,
                                                })
                                                : ""}
                                        </span>
                                    </div>
                                </div>
                            </header>

                            {/* Featured Image */}
                            {post.image && (
                                <div
                                    className="w-full h-64 md:h-96 bg-cover bg-center rounded-lg mb-8"
                                    style={{ backgroundImage: `url("${post.image}")` }}
                                ></div>
                            )}

                            {/* Content */}
                            <RichText
                                content={post.content}
                                className="prose-lg prose-headings:text-text-main dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-primary hover:prose-a:text-primary-dark prose-strong:text-text-main dark:prose-strong:text-white"
                            />
                        </article>
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
