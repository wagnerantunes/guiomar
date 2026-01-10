import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Footer } from "@/components/landing/Footer";
import {
    SearchWidget,
    NewsletterWidget,
    CategoriesWidget,
    TagsWidget,
    TableOfContents,
    ShareButtons,
} from "@/components/blog";
import { RichText } from "@/components/ui/RichText";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function calculateReadingTime(content: string) {
    const wordsPerMinute = 200;
    const cleanText = content.replace(/<[^>]*>/g, ""); // Strip HTML tags
    const numberOfWords = cleanText.split(/\s+/).length;
    const minutes = Math.ceil(numberOfWords / wordsPerMinute);
    return minutes;
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

    // Fetch adjacent posts
    const [nextPost, prevPost] = await Promise.all([
        prisma.post.findFirst({
            where: {
                siteId: post.siteId,
                status: "PUBLISHED",
                publishedAt: { gt: post.publishedAt! },
            },
            orderBy: { publishedAt: "asc" },
            select: { title: true, slug: true, image: true },
        }),
        prisma.post.findFirst({
            where: {
                siteId: post.siteId,
                status: "PUBLISHED",
                publishedAt: { lt: post.publishedAt! },
            },
            orderBy: { publishedAt: "desc" },
            select: { title: true, slug: true, image: true },
        })
    ]);

    // Fetch Related Posts (Same Category, excluding current)
    const relatedPosts = post.categoryId ? await prisma.post.findMany({
        where: {
            siteId: post.siteId,
            categoryId: post.categoryId,
            id: { not: post.id },
            status: "PUBLISHED",
        },
        take: 3,
        orderBy: { publishedAt: "desc" },
        include: { author: true, category: true }
    }) : [];

    // Parse Content: Inject IDs for TOC and build TOC array
    let tocItems: { id: string; text: string; level: number }[] = [];
    let cleanContent = post.content;

    // Remove custom image position comments if any
    cleanContent = cleanContent.replace(/<!-- image_position:.*? -->/g, '');

    // Process Headings
    cleanContent = cleanContent.replace(/<h([2-3])>(.*?)<\/h\1>/g, (match, level, text) => {
        const id = slugify(text);
        tocItems.push({ id, text: text.replace(/<[^>]*>/g, ""), level: parseInt(level) });
        return `<h${level} id="${id}">${text}</h${level}>`;
    });

    const readingTime = calculateReadingTime(cleanContent);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://renovamente-guiomarmelo.com.br';

    // Enhanced JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": post.image ? [post.image] : [`${baseUrl}/og-image.jpg`],
        "datePublished": post.publishedAt?.toISOString() || post.createdAt.toISOString(),
        "dateModified": post.updatedAt.toISOString(),
        "author": {
            "@type": "Person",
            "name": post.author.name,
            "url": `${baseUrl}/sobre` // Assuming author page or generic
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
        "articleBody": cleanContent.replace(/<[^>]*>/g, "").substring(0, 150) + "...",
        "wordCount": cleanContent.split(/\s+/).length,
        "timeRequired": `PT${readingTime}M`,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${baseUrl}/blog/${post.slug}`
        },
        "keywords": categories.map(c => c.name).join(", ")
    };

    // Breadcrumbs Schema
    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Início", "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${baseUrl}/blog` },
            { "@type": "ListItem", "position": 3, "name": post.category?.name || "Geral", "item": `${baseUrl}/blog/category/${post.category?.slug || 'geral'}` },
            { "@type": "ListItem", "position": 4, "name": post.title }
        ]
    };

    let imagePosition = 'center';
    const metaMatch = post.content.match(/<!-- image_position:(.*?) -->/);
    if (metaMatch) {
        imagePosition = metaMatch[1];
    }

    return (
        <div className="bg-background font-sans min-h-screen flex flex-col relative selection:bg-primary/30 selection:text-primary-foreground text-foreground">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent blur-3xl opacity-30" />
                <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full opacity-20" />
            </div>

            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-32 md:py-40">

                {/* Visual Breadcrumbs */}
                <nav className="mb-8 flex items-center gap-2 text-[11px] text-muted-foreground uppercase tracking-widest font-bold">
                    <Link href="/" className="hover:text-primary transition-colors">Início</Link>
                    <span>/</span>
                    <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                    {post.category && (
                        <>
                            <span>/</span>
                            <Link href="#" className="hover:text-primary transition-colors">{post.category.name}</Link>
                        </>
                    )}
                </nav>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* LEFT COLUMN: Share Buttons (Desktop Sticky) */}
                    <div className="hidden xl:flex flex-col gap-4 w-[60px] relative">
                        <div className="sticky top-40">
                            <ShareButtons title={post.title} />
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <main className="w-full xl:w-[60%] flex flex-col gap-12">
                        <article className="bg-card border border-border rounded-[2.5rem] p-6 md:p-12 relative overflow-hidden shadow-sm">
                            <div className="absolute inset-0 bg-background/50 backdrop-blur-3xl -z-10"></div>

                            {/* Internal Header */}
                            <header className="mb-10 border-b border-border pb-10">
                                {post.category && (
                                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest mb-6 border border-primary/20">
                                        {post.category.name}
                                    </span>
                                )}
                                <h1 className="text-3xl md:text-5xl lg:text-5xl font-black text-foreground mb-8 leading-[1.1] tracking-tighter">
                                    {post.title}
                                </h1>

                                <div className="flex flex-wrap items-center justify-between gap-6 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            {post.author.image ? (
                                                <div
                                                    className="size-10 rounded-xl bg-muted bg-cover border border-border"
                                                    style={{ backgroundImage: `url("${post.author.image}")` }}
                                                />
                                            ) : (
                                                <div className="size-10 rounded-xl bg-muted flex items-center justify-center border border-border">
                                                    <span className="material-symbols-outlined text-muted-foreground">person</span>
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-foreground">{post.author.name}</span>
                                                <span className="text-[9px] text-primary">Autor</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2" title="Data de publicação">
                                            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                            <span>
                                                {post.publishedAt
                                                    ? format(new Date(post.publishedAt), "d 'de' MMM, yyyy", { locale: ptBR })
                                                    : ""}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2" title="Tempo de leitura estimado">
                                            <span className="material-symbols-outlined text-[16px]">schedule</span>
                                            <span>{readingTime} min de leitura</span>
                                        </div>
                                    </div>
                                </div>
                            </header>

                            {/* Mobile Share Buttons (Visible only on smaller screens) */}
                            <div className="xl:hidden mb-8">
                                <ShareButtons title={post.title} />
                            </div>

                            {/* Featured Image */}
                            {post.image && (
                                <div
                                    className="w-full aspect-video bg-cover rounded-[2rem] mb-12 shadow-md border border-border"
                                    style={{
                                        backgroundImage: `url("${post.image}")`,
                                        backgroundPosition: `${imagePosition} center`
                                    }}
                                ></div>
                            )}

                            {/* Content */}
                            <RichText
                                content={cleanContent}
                                className="prose-lg max-w-none text-muted-foreground prose-headings:font-black prose-headings:tracking-tight prose-headings:text-foreground prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:text-foreground prose-code:text-primary prose-pre:bg-muted prose-li:text-muted-foreground pointer-events-auto"
                            />

                            {/* Author Bio Box */}
                            <div className="mt-16 pt-10 border-t border-border">
                                <div className="bg-muted/30 rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                                    {post.author.image ? (
                                        <div className="size-20 rounded-2xl bg-cover border-2 border-border shrink-0" style={{ backgroundImage: `url("${post.author.image}")` }} />
                                    ) : (
                                        <div className="size-20 rounded-2xl bg-muted flex items-center justify-center shrink-0 border border-border">
                                            <span className="material-symbols-outlined text-3xl text-muted-foreground">person</span>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-primary text-xs font-black uppercase tracking-widest mb-1 block">Sobre o Autor</span>
                                        <h3 className="text-xl font-bold text-foreground mb-2">{post.author.name}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {/* Assuming logic for bio if it existed on schema, strictly creating placeholder if not specific data */}
                                            Especialista em bem-estar corporativo e produtividade sustentável. Apaixonado por transformar ambientes de trabalho através da ergonomia e gestão humanizada.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </article>

                        {/* Related Posts */}
                        {relatedPosts.length > 0 && (
                            <section>
                                <h3 className="text-2xl font-black text-foreground mb-8 flex items-center gap-3">
                                    <span className="w-8 h-1 bg-primary rounded-full"></span>
                                    Você também pode gostar
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6">
                                    {/* Reusing a simplified card logic or just listing them nicely */}
                                    {relatedPosts.map(rp => (
                                        <Link key={rp.id} href={`/blog/${rp.slug}`} className="group bg-card rounded-[2rem] p-6 border border-border hover:border-primary/30 transition-all shadow-sm">
                                            {rp.image && (
                                                <div className="aspect-[16/9] bg-cover rounded-xl mb-4 opacity-90 group-hover:opacity-100 transition-opacity" style={{ backgroundImage: `url("${rp.image}")` }} />
                                            )}
                                            <span className="text-[9px] text-primary font-black uppercase tracking-widest">{rp.category?.name}</span>
                                            <h4 className="text-lg font-bold text-card-foreground mt-2 group-hover:text-primary transition-colors line-clamp-2">{rp.title}</h4>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}


                        {/* Navigation / Next Post */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* ... Keep existing nav logic but simpler ... */}
                            {prevPost ? (
                                <Link
                                    href={`/blog/${prevPost.slug}`}
                                    className="group bg-card rounded-[2rem] p-8 hover:bg-primary/5 transition-all border border-border flex flex-col h-full relative overflow-hidden shadow-sm"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Anterior</span>
                                    <h4 className="text-lg font-bold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                                        {prevPost.title}
                                    </h4>
                                </Link>
                            ) : <div></div>}

                            {nextPost ? (
                                <Link
                                    href={`/blog/${nextPost.slug}`}
                                    className="group bg-card rounded-[2rem] p-8 hover:bg-primary/5 transition-all border border-border flex flex-col h-full text-right relative overflow-hidden shadow-sm"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Próximo</span>
                                    <h4 className="text-lg font-bold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                                        {nextPost.title}
                                    </h4>
                                </Link>
                            ) : <div></div>}
                        </div>
                    </main>

                    {/* RIGHT COLUMN: Sidebar */}
                    <aside className="w-full xl:w-[35%] flex flex-col gap-8 h-fit">
                        {/* Search Widget */}
                        <SearchWidget />

                        {/* Table of Contents (Sticky) */}
                        <div className="sticky top-32 flex flex-col gap-8">
                            {tocItems.length > 0 && <TableOfContents items={tocItems} />}
                            <NewsletterWidget />
                            <CategoriesWidget categories={categories} />
                            <TagsWidget />
                        </div>
                    </aside>
                </div>
            </div>

            <Footer />
        </div>
    );
}
