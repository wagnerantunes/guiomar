import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SearchWidget, NewsletterWidget, CategoriesWidget, TableOfContents, ReadingProgressBar } from "@/components/blog";
import { RichText } from "@/components/ui/RichText";
import { calculateReadingTime } from "@/lib/blog-utils";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Calendar, User, Clock } from "lucide-react";
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
        <div className="bg-background min-h-screen flex flex-col relative selection:bg-primary/30 text-foreground">
            <ReadingProgressBar />
            
            {/* Header / Hero Image Only */}
            <div className="relative w-full h-[50vh] min-h-[350px] overflow-hidden mt-0">
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
                {/* Gradient for smooth transition */}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90" />
            </div>

            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 -mt-32 md:-mt-48 pb-20">
                {/* Title Block - Now distinct from image */}
                <div className="max-w-5xl mx-auto text-center mb-16 px-4">
                    <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-[3rem] p-8 md:p-12 shadow-2xl">
                         {post.category && (
                            <Link href={`/blog?category=${post.category.slug}`} className="inline-block px-5 py-2 text-[10px] font-black bg-primary/10 text-primary border border-primary/20 rounded-full uppercase tracking-widest mb-8 hover:bg-primary hover:text-primary-foreground transition-all">
                                {post.category.name}
                            </Link>
                        )}
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground mb-8 leading-tight tracking-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <div className="flex items-center gap-2 bg-muted/10 px-3 py-1.5 rounded-lg border border-border">
                                <User size={14} className="text-primary" />
                                {post.author.name}
                            </div>
                            <div className="flex items-center gap-2 bg-muted/10 px-3 py-1.5 rounded-lg border border-border">
                                <Calendar size={14} className="text-primary" />
                                {post.publishedAt ? format(new Date(post.publishedAt), "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Recente"}
                            </div>
                            <div className="flex items-center gap-2 bg-muted/10 px-3 py-1.5 rounded-lg border border-border">
                                <Clock size={14} className="text-primary" />
                                {rTime} min de leitura
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-8">
                    <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                    <ChevronRight size={12} />
                    <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
                </nav>

                <main className="flex flex-col lg:flex-row gap-10">
                    <section className="w-full xl:w-[68%]">
                        <article className="bg-card border border-border rounded-[2rem] p-6 md:p-10 shadow-sm relative">
                             {/* Content */}
                            <div className="absolute -left-10 top-12 hidden xl:block z-20"> {/* Ajustei para -left-10 para dar mais espaco se possivel, ou manter -left-4 se o design for colado */}
                                <ShareButtons title={post.title} />
                            </div>
                            <RichText content={content} />
                            
                            <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {post.author.image && (
                                        <div className="relative size-12 rounded-full overflow-hidden border border-border">
                                            <Image src={post.author.image} alt={post.author.name || ""} fill className="object-cover" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Escrito por</p>
                                        <p className="text-sm font-bold text-foreground">{post.author.name}</p>
                                    </div>
                                </div>
                                <div className="xl:hidden">
                                    <ShareButtons title={post.title} />
                                </div>
                            </div>
                        </article>
                    </section>
                    
                    <aside className="w-full xl:w-[35%] flex flex-col gap-8 h-fit sticky top-32">
                        <SearchWidget />
                        <TableOfContents items={tItems} />
                        <NewsletterWidget />
                        <CategoriesWidget categories={categories} />
                    </aside>
                </main>
            </div>
        </div>
    );
}
