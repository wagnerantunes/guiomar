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

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://renovamente-guiomarmelo.com.br';

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": post.image || `${baseUrl}/og-image.jpg`,
        "datePublished": post.publishedAt?.toISOString() || post.createdAt.toISOString(),
        "dateModified": post.updatedAt.toISOString(),
        "author": {
            "@type": "Person",
            "name": post.author.name,
            "url": baseUrl
        },
        "publisher": {
            "@type": "Organization",
            "name": "RenovaMente",
            "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/logo.png`
            }
        },
        "description": post.excerpt || post.title,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${baseUrl}/blog/${post.slug}`
        }
    };

    return (
        <div className="bg-[#09090b] font-sans min-h-screen flex flex-col relative selection:bg-[#13ec5b] selection:text-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header />

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#13ec5b]/5 to-transparent blur-3xl opacity-30" />
                <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full opacity-20" />
            </div>

            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-32 md:py-40">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left Column: Content */}
                    <main className="w-full lg:w-[65%] flex flex-col gap-16">
                        <article className="bg-[#09090b] border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-3xl -z-10"></div>

                            {/* Breadcrumb / Back Link */}
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-[#13ec5b] mb-12 transition-colors text-[10px] uppercase tracking-[0.2em]"
                            >
                                <span className="material-symbols-outlined text-[16px]">
                                    arrow_back
                                </span>
                                Voltar para o blog
                            </Link>

                            {/* Header */}
                            <header className="mb-12 border-b border-white/5 pb-10">
                                {post.category && (
                                    <span className="inline-block px-4 py-1.5 bg-[#13ec5b]/10 text-[#13ec5b] rounded-full text-[9px] font-black uppercase tracking-widest mb-6 border border-[#13ec5b]/20">
                                        {post.category.name}
                                    </span>
                                )}
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
                                    {post.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-8 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                    <div className="flex items-center gap-3">
                                        {post.author.image ? (
                                            <div
                                                className="size-10 rounded-xl bg-gray-800 bg-cover border border-white/10"
                                                style={{
                                                    backgroundImage: `url("${post.author.image}")`,
                                                }}
                                            />
                                        ) : (
                                            <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                                <span className="material-symbols-outlined text-gray-500">person</span>
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-white">{post.author.name}</span>
                                            <span className="text-[9px] text-[#13ec5b]">Autor</span>
                                        </div>
                                    </div>
                                    <div className="h-4 w-px bg-white/10"></div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">
                                            calendar_today
                                        </span>
                                        <span>
                                            {post.publishedAt
                                                ? format(new Date(post.publishedAt), "d 'de' MMMM, yyyy", {
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
                                    className="w-full aspect-video bg-cover bg-center rounded-[2rem] mb-16 shadow-2xl border border-white/5"
                                    style={{ backgroundImage: `url("${post.image}")` }}
                                ></div>
                            )}

                            {/* Content */}
                            <RichText
                                content={post.content}
                                className="prose-lg max-w-none text-gray-300 prose-headings:font-black prose-headings:tracking-tight prose-headings:text-white prose-p:leading-relaxed prose-a:text-[#13ec5b] hover:prose-a:text-[#13ec5b]/80 prose-strong:text-white prose-blockquote:border-[#13ec5b] prose-blockquote:bg-[#13ec5b]/5 prose-blockquote:text-white prose-code:text-[#13ec5b] prose-pre:bg-black/50 prose-li:text-gray-300 pointer-events-auto"
                            />
                        </article>

                        {/* Navigation / Next Post (Optional placeholder) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Link href="/blog" className="group bg-white/5 rounded-[2rem] p-8 hover:bg-white/10 transition-colors border border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#13ec5b] mb-2 block">Anterior</span>
                                <h4 className="text-lg font-bold text-white group-hover:underline decoration-[#13ec5b] decoration-2 underline-offset-4">Explorar mais artigos</h4>
                            </Link>
                        </div>
                    </main>

                    {/* Right Column: Sidebar */}
                    <aside className="w-full lg:w-[35%] flex flex-col gap-8 sticky top-32 h-fit">
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
