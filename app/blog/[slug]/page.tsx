import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Footer } from "@/components/landing/Footer";
import { SearchWidget, NewsletterWidget, CategoriesWidget, TableOfContents, ReadingProgressBar } from "@/components/blog";
import { RichText } from "@/components/ui/RichText";
import { calculateReadingTime } from "@/lib/blog-utils";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Calendar, User, Clock, Share2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShareButtons } from "@/components/blog/ShareButtons";

export const dynamic = "force-dynamic";

function slugify(text: string) {
    return text.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await prisma.post.findFirst({
        where: { slug, status: "PUBLISHED" },
    });
    if (!post) return { title: "Post não encontrado" };
    return {
        title: `${post.title} | Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt || "",
            images: post.image ? [{ url: post.image }] : [],
            type: "article",
        },
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await prisma.post.findFirst({
        where: { slug, status: "PUBLISHED" },
        include: { category: true, author: true },
    });
    
    if (!post) return notFound();

    // Increment views
    await prisma.post.update({
        where: { id: post.id },
        data: { views: { increment: 1 } }
    }).catch(e => console.error("Error updating views:", e));

    const categories = await prisma.category.findMany({ 
        where: { siteId: post.siteId }, 
        include: { _count: { select: { posts: true } } } 
    });

    let tItems: { id: string; text: string; level: number }[] = [];
    let content = post.content.replace(/<h([2-3])>(.*?)<\/h\1>/g, (m, l, t) => {
        const id = slugify(t);
        tItems.push({ id, text: t.replace(/<[^>]*>/g, ""), level: parseInt(l) });
        return `<h${l} id="${id}">${t}</h${l}>`;
    });

    const rTime = calculateReadingTime(content);

    return (
        <div className="bg-background min-h-screen flex flex-col relative selection:bg-primary/30">
            <ReadingProgressBar />
            
            {/* Header / Hero */}
            <div className="relative w-full h-[50vh] min-h-[350px] overflow-hidden">
                {post.image ? (
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                )}
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-end justify-center pb-12">
                    <div className="w-full max-w-[1400px] px-6">
                        <div className="max-w-[800px]">
                            {post.category && (
                                <span className="inline-block px-4 py-1.5 text-[10px] font-black bg-primary text-primary-foreground rounded-full uppercase tracking-widest mb-6">
                                    {post.category.name}
                                </span>
                            )}
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                                {post.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/80">
                                <div className="flex items-center gap-2">
                                    <User size={14} className="text-primary" />
                                    {post.author.name}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-primary" />
                                    {post.publishedAt ? format(new Date(post.publishedAt), "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Recente"}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-primary" />
                                    {rTime} min de leitura
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-10">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-10">
                    <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                    <ChevronRight size={12} />
                    <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
                </nav>

                <main className="flex flex-col lg:flex-row gap-10">
                    <section className="w-full xl:w-[68%]">
                        <article className="bg-card border border-border rounded-[2rem] p-6 md:p-10 shadow-sm relative">
                            <div className="absolute -left-4 top-12 hidden xl:block">
                                <ShareButtons title={post.title} />
                            </div>
                            <RichText content={content} />
                            
                            <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {post.author.image && (
                                        <div className="relative size-12 rounded-full overflow-hidden">
                                            <Image src={post.author.image} alt={post.author.name || ""} fill className="object-cover" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Escrito por</p>
                                        <p className="text-sm font-bold">{post.author.name}</p>
                                    </div>
                                </div>
                                <div className="xl:hidden">
                                    <ShareButtons title={post.title} />
                                </div>
                            </div>
                        </article>
                    </section>
                    
                    <aside className="w-full xl:w-[35%] flex flex-col gap-8 h-fit sticky top-24">
                        <SearchWidget />
                        <TableOfContents items={tItems} />
                        <NewsletterWidget />
                        <CategoriesWidget categories={categories} />
                    </aside>
                </main>
            </div>
            <Footer />
        </div>
    );
}
