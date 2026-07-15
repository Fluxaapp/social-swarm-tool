import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { 
  Plus, Search, Edit, Trash2, ArrowUpDown, Loader2, X, AlertTriangle, Eye, ArrowUpRight, Save, Layout, List, Settings, ChevronUp, ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { 
  getProducts, saveProduct, deleteProduct, getLayout, saveLayout, formatBRL, CATEGORIES, typeLabel, type Product, type ProductType, type ProductStatus, type ShopLayout
} from "@/lib/shop/products";

export const Route = createFileRoute("/admin/products")({
  loader: async () => {
    try {
      const products = await getProducts();
      const layout = await getLayout();
      return { products: products || [], layout };
    } catch (error) {
      console.error("Error loading products/layout in admin products loader", error);
      return { products: [], layout: { heroTitle: "", heroDescription: "" } };
    }
  },
  component: AdminProducts,
});

function AdminProducts() {
  const { products: initialProducts, layout: initialLayout } = Route.useLoaderData();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeTab, setActiveTab] = useState<"table" | "preview">("table");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Layout Configuration states
  const [heroTitle, setHeroTitle] = useState(initialLayout.heroTitle || "");
  const [heroDescription, setHeroDescription] = useState(initialLayout.heroDescription || "");
  const [bannerUrl, setBannerUrl] = useState(initialLayout.bannerUrl || "");
  const [bannerText, setBannerText] = useState(initialLayout.bannerText || "");
  const [isSavingLayout, setIsSavingLayout] = useState(false);
  const [isLayoutSettingsOpen, setIsLayoutSettingsOpen] = useState(false);
  
  // Table search/filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "price" | "order">("order");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form fields
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCategory, setFormCategory] = useState(CATEGORIES[0].id);
  const [formType, setFormType] = useState<ProductType>("digital");
  const [formStatus, setFormStatus] = useState<ProductStatus>("publicado");
  const [formPrice, setFormPrice] = useState("");
  const [formPromoPrice, setFormPromoPrice] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formGallery, setFormGallery] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formBestSeller, setFormBestSeller] = useState(false);
  const [formDisplayOrder, setFormDisplayOrder] = useState("0");
  const [formPurchaseUrl, setFormPurchaseUrl] = useState("");
  const [formDemoUrl, setFormDemoUrl] = useState("");
  const [formSeoTitle, setFormSeoTitle] = useState("");
  const [formSeoDesc, setFormSeoDesc] = useState("");
  
  // Custom type specific fields
  const [formLicDuration, setFormLicDuration] = useState("");
  const [formLicVersion, setFormLicVersion] = useState("");
  const [formDeliveryTime, setFormDeliveryTime] = useState("");
  const [formFilesList, setFormFilesList] = useState("");

  // Deletion confirm state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Sync state with loader data
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Slug auto-generation from Name
  useEffect(() => {
    if (!editingProduct) {
      const generated = formName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-z0-9\s-]/g, "") // Remove spec chars
        .trim()
        .replace(/\s+/g, "-");
      setFormSlug(generated);
    }
  }, [formName, editingProduct]);

  // Save layout configurations
  const handleSaveLayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingLayout(true);
    try {
      await saveLayout({
        data: {
          heroTitle,
          heroDescription,
          bannerUrl: bannerUrl || undefined,
          bannerText: bannerText || undefined
        }
      });
      toast.success("Design e banners da loja atualizados!");
      setIsLayoutSettingsOpen(false);
      router.invalidate();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar configurações do layout.");
    } finally {
      setIsSavingLayout(false);
    }
  };

  // Reorder display order up/down
  const handleMoveOrder = async (p: Product, direction: "up" | "down") => {
    const currentOrder = p.displayOrder || 0;
    const nextOrder = direction === "up" ? Math.max(1, currentOrder - 1) : currentOrder + 1;
    
    setIsSubmitting(true);
    try {
      // Find the item that currently occupies the target display order
      const targetItem = products.find(x => x.displayOrder === nextOrder);
      
      // Save current item with new order
      await saveProduct({ data: { ...p, displayOrder: nextOrder } });
      
      // Swapping target item order if exists
      if (targetItem) {
        await saveProduct({ data: { ...targetItem, displayOrder: currentOrder } });
      }
      
      toast.success("Ordem reordenada com sucesso!");
      router.invalidate();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao alterar a ordem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Form for Create
  const handleCreateOpen = (categoryPreFill?: string) => {
    setEditingProduct(null);
    setFormName("");
    setFormSlug("");
    setFormShortDesc("");
    setFormDesc("");
    setFormCategory(categoryPreFill || CATEGORIES[0].id);
    setFormType("digital");
    setFormStatus("publicado");
    setFormPrice("");
    setFormPromoPrice("");
    setFormImage("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80");
    setFormGallery("");
    setFormBadge("");
    setFormFeatured(false);
    setFormBestSeller(false);
    setFormDisplayOrder(String(products.length + 1));
    setFormPurchaseUrl("");
    setFormDemoUrl("");
    setFormSeoTitle("");
    setFormSeoDesc("");
    setFormLicDuration("");
    setFormLicVersion("");
    setFormDeliveryTime("");
    setFormFilesList("");
    setIsFormOpen(true);
  };

  // Open Form for Edit
  const handleEditOpen = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormSlug(p.slug);
    setFormShortDesc(p.shortDescription);
    setFormDesc(p.description);
    setFormCategory(p.categoryId);
    setFormType(p.type);
    setFormStatus(p.status);
    setFormPrice(String(p.price));
    setFormPromoPrice(p.promoPrice ? String(p.promoPrice) : "");
    setFormImage(p.image);
    setFormGallery(p.gallery ? p.gallery.join("\n") : "");
    setFormBadge(p.badge || "");
    setFormFeatured(!!p.featured);
    setFormBestSeller(!!p.bestSeller);
    setFormDisplayOrder(String(p.displayOrder || 0));
    setFormPurchaseUrl(p.purchaseUrl || "");
    setFormDemoUrl(p.demoUrl || "");
    setFormSeoTitle(p.seoTitle || "");
    setFormSeoDesc(p.seoDescription || "");
    setFormLicDuration(p.license?.duration || "");
    setFormLicVersion(p.license?.version || "");
    setFormDeliveryTime(p.deliveryTime || "");
    
    const formattedFiles = p.files 
      ? p.files.map(f => `${f.name}${f.size ? `,${f.size}` : ""}`).join("\n")
      : "";
    setFormFilesList(formattedFiles);
    
    setIsFormOpen(true);
  };

  // Submit Product Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSlug) {
      toast.error("O slug do produto é obrigatório.");
      return;
    }
    
    setIsSubmitting(true);
    
    const galleryArr = formGallery
      .split("\n")
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const filesArr = formFilesList
      .split("\n")
      .map(line => {
        const parts = line.split(",");
        if (parts[0]) {
          return { name: parts[0].trim(), size: parts[1] ? parts[1].trim() : undefined };
        }
        return null;
      })
      .filter(Boolean) as { name: string; size?: string }[];

    const payload: Product = {
      slug: formSlug,
      name: formName,
      shortDescription: formShortDesc,
      description: formDesc,
      price: parseFloat(formPrice) || 0,
      promoPrice: formPromoPrice ? parseFloat(formPromoPrice) : null,
      image: formImage,
      gallery: galleryArr.length > 0 ? galleryArr : undefined,
      categoryId: formCategory,
      type: formType,
      status: formStatus,
      featured: formFeatured,
      bestSeller: formBestSeller || formBadge === "Mais Vendido",
      badge: formBadge || undefined,
      displayOrder: parseInt(formDisplayOrder) || 0,
      purchaseUrl: formPurchaseUrl || undefined,
      demoUrl: formDemoUrl || undefined,
      seoTitle: formSeoTitle || undefined,
      seoDescription: formSeoDesc || undefined,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString().split("T")[0],
      license: formLicDuration ? { duration: formLicDuration, version: formLicVersion || undefined } : undefined,
      files: filesArr.length > 0 ? filesArr : undefined,
      deliveryTime: formDeliveryTime || undefined,
    };

    try {
      await saveProduct({ data: payload });
      toast.success(editingProduct ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!");
      setIsFormOpen(false);
      router.invalidate();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar produto no banco de dados.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Product Action
  const handleDelete = async () => {
    if (!productToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteProduct({ data: productToDelete.slug });
      toast.success(`Produto "${productToDelete.name}" excluído.`);
      setProductToDelete(null);
      router.invalidate();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir produto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sort handler
  const handleSort = (field: "name" | "price" | "order") => {
    if (sortBy === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch = 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          p.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.slug.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || p.categoryId === selectedCategory;
        const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        let valA: any = a[sortBy === "name" ? "name" : sortBy === "price" ? "price" : "displayOrder"] || 0;
        let valB: any = b[sortBy === "name" ? "name" : sortBy === "price" ? "price" : "displayOrder"] || 0;

        if (sortBy === "name") {
          return sortOrder === "asc" 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        } else {
          return sortOrder === "asc" 
            ? (valA as number) - (valB as number) 
            : (valB as number) - (valA as number);
        }
      });
  }, [products, searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder]);

  // Paginated list
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus]);

  // Dynamic layout helpers for Preview Mode
  const activeProducts = products.filter(p => p.status === "publicado");
  const featured = activeProducts.filter((p) => p.featured);
  const best = activeProducts.filter((p) => p.bestSeller || p.badge === "Mais Vendido");
  const recent = [...activeProducts].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")).slice(0, 6);

  return (
    <div className="space-y-6 max-w-full font-sans text-ink">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">Gerenciador da Loja</h1>
          <p className="text-xs text-dim mt-1">Configure o layout, adicione banners e gerencie produtos em tabelas ou modo de visualização interativa.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLayoutSettingsOpen(!isLayoutSettingsOpen)}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-line bg-paper text-ink font-medium text-[12px] uppercase hover:border-ink/50 hover:bg-soft transition-all"
          >
            <Settings className="h-4 w-4" /> Banners & Seções
          </button>
          <button
            onClick={() => handleCreateOpen()}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-ink text-paper font-medium text-[12px] uppercase hover:bg-ink/90 transition-all shadow-md"
          >
            <Plus className="h-4 w-4" /> Cadastrar Produto
          </button>
        </div>
      </div>

      {/* DYNAMIC LAYOUT ACCORDION PANEL */}
      {isLayoutSettingsOpen && (
        <form onSubmit={handleSaveLayout} className="bg-soft border border-line rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <h3 className="font-semibold text-sm text-ink flex items-center gap-2">
              <Layout className="h-4 w-4" /> Configurar Textos e Banners da Loja
            </h3>
            <button 
              type="button" 
              onClick={() => setIsLayoutSettingsOpen(false)}
              className="text-dim hover:text-ink transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-dim mb-1 font-semibold">Título Principal do Hero *</label>
              <textarea
                required
                rows={2}
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="Produtos digitais com identidade editorial..."
                className="w-full bg-paper border border-line rounded-xl p-2.5 text-xs text-ink focus:border-ink/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-dim mb-1 font-semibold">Descrição do Hero *</label>
              <textarea
                required
                rows={2}
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                placeholder="Templates e licenças da Glass Maind..."
                className="w-full bg-paper border border-line rounded-xl p-2.5 text-xs text-ink focus:border-ink/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-dim mb-1 font-semibold">URL do Banner Promocional</label>
              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full h-10 bg-paper border border-line rounded-xl px-3 text-xs text-ink focus:border-ink/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-dim mb-1 font-semibold">Texto do Banner Promocional</label>
              <input
                type="text"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="Ex: 30% OFF em todos os templates!"
                className="w-full h-10 bg-paper border border-line rounded-xl px-3 text-xs text-ink focus:border-ink/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsLayoutSettingsOpen(false)}
              className="h-10 px-4 rounded-full border border-line hover:bg-paper text-[12px] uppercase font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSavingLayout}
              className="h-10 px-5 rounded-full bg-ink text-paper text-[12px] uppercase font-semibold hover:bg-ink/90 active:scale-[0.99] transition-all flex items-center gap-2"
            >
              {isSavingLayout ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</>
              ) : (
                <><Save className="h-4 w-4" /> Salvar Layout</>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Tabs Menu Selector */}
      <div className="flex items-center border-b border-line gap-2 select-none">
        <button
          onClick={() => setActiveTab("table")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === "table" 
              ? "border-ink text-ink" 
              : "border-transparent text-dim hover:text-ink"
          }`}
        >
          <List className="h-4 w-4" /> Visão Geral (Tabela)
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === "preview" 
              ? "border-ink text-ink" 
              : "border-transparent text-dim hover:text-ink"
          }`}
        >
          <Layout className="h-4 w-4" /> Visualizar e Editar na Loja
        </button>
      </div>

      {/* TAB 1: GENERAL MANAGEMENT TABLE VIEW */}
      {activeTab === "table" && (
        <div className="space-y-6">
          {/* Filters toolbar */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-soft p-4 border border-line rounded-2xl">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/30 pointer-events-none" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, slug ou descrição..."
                className="w-full h-10 bg-paper border border-line rounded-xl pl-10 pr-4 text-xs text-ink placeholder:text-ink/30 focus:border-ink/50 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-dim font-bold">Categoria</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-10 bg-paper border border-line rounded-xl px-3 text-xs text-ink focus:border-ink/50 focus:outline-none"
                >
                  <option value="all">Todas as Categorias</option>
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-dim font-bold">Status</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="h-10 bg-paper border border-line rounded-xl px-3 text-xs text-ink focus:border-ink/50 focus:outline-none"
                >
                  <option value="all">Todos</option>
                  <option value="publicado">Ativo (Publicado)</option>
                  <option value="rascunho">Rascunho</option>
                  <option value="oculto">Oculto</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-paper border border-line rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-line bg-soft/50 text-[10px] uppercase tracking-wider text-dim font-bold select-none">
                    <th className="py-4 px-6">Produto</th>
                    <th className="py-4 px-4 cursor-pointer hover:text-ink transition-colors" onClick={() => handleSort("order")}>
                      <span className="flex items-center gap-1">Ordem <ArrowUpDown className="h-3 w-3" /></span>
                    </th>
                    <th className="py-4 px-4">Categoria</th>
                    <th className="py-4 px-4 cursor-pointer hover:text-ink transition-colors" onClick={() => handleSort("price")}>
                      <span className="flex items-center gap-1">Preço <ArrowUpDown className="h-3 w-3" /></span>
                    </th>
                    <th className="py-4 px-4 text-center">Destaque</th>
                    <th className="py-4 px-4 text-center">Status</th>
                    <th className="py-4 px-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((p) => {
                      const hasPromo = p.promoPrice && p.promoPrice > 0;
                      return (
                        <tr key={p.slug} className="hover:bg-soft/20 transition-colors">
                          <td className="py-4 px-6 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-soft border border-line overflow-hidden shrink-0">
                              <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <span className="block font-semibold text-ink truncate max-w-[200px]">{p.name}</span>
                              <span className="block text-[10px] text-dim mt-1 truncate max-w-[200px]">{p.slug}</span>
                            </div>
                          </td>
                          
                          <td className="py-4 px-4 font-mono font-medium text-ink/70">
                            <div className="flex items-center gap-2">
                              <span>{p.displayOrder ?? 0}</span>
                              <div className="flex flex-col">
                                <button onClick={() => handleMoveOrder(p, "up")} className="p-0.5 hover:text-ink text-dim shrink-0"><ChevronUp className="h-3 w-3" /></button>
                                <button onClick={() => handleMoveOrder(p, "down")} className="p-0.5 hover:text-ink text-dim shrink-0"><ChevronDown className="h-3 w-3" /></button>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-ink/75 font-medium">
                            {CATEGORIES.find(c => c.id === p.categoryId)?.name || p.categoryId}
                          </td>

                          <td className="py-4 px-4 text-ink font-semibold font-mono">
                            {hasPromo ? (
                              <div className="space-y-0.5">
                                <span className="block text-ink">{formatBRL(p.promoPrice!)}</span>
                                <span className="block text-[10px] text-dim line-through">{formatBRL(p.price)}</span>
                              </div>
                            ) : (
                              <span>{formatBRL(p.price)}</span>
                            )}
                          </td>

                          <td className="py-4 px-4 text-center">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                              p.featured 
                                ? "bg-ink text-paper font-semibold" 
                                : "text-dim bg-soft border border-line"
                            }`}>
                              {p.featured ? "Destaque" : "Normal"}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                              p.status === "publicado"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : p.status === "rascunho"
                                ? "bg-amber-50 border-amber-200 text-amber-700"
                                : "bg-soft border-line text-dim"
                            }`}>
                              {p.status === "publicado" ? "Ativo" : p.status === "rascunho" ? "Rascunho" : "Oculto"}
                            </span>
                          </td>

                          <td className="py-4 px-6 text-right space-x-1.5">
                            <a
                              href={`/loja/produto/${p.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-dim hover:text-ink hover:border-ink/50 transition-colors"
                              title="Ver na loja"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </a>
                            <button
                              onClick={() => handleEditOpen(p)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-dim hover:text-ink hover:border-ink/50 transition-colors"
                              title="Editar"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setProductToDelete(p)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-dim">
                        Nenhum produto cadastrado ou filtro ativo.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-soft/30 border-t border-line px-6 py-4 flex items-center justify-between text-xs text-dim select-none">
              <div>
                Mostrando <span className="text-ink font-mono">{(currentPage - 1) * itemsPerPage + 1}</span> a{" "}
                <span className="text-ink font-mono">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> de{" "}
                <span className="text-ink font-mono">{filteredProducts.length}</span> produtos.
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-3 rounded-full border border-line bg-paper hover:border-ink/40 disabled:opacity-40 disabled:pointer-events-none transition"
                >
                  Anterior
                </button>
                <span>
                  Página <span className="text-ink font-semibold">{currentPage}</span> de <span className="text-ink font-semibold">{totalPages}</span>
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-8 px-3 rounded-full border border-line bg-paper hover:border-ink/40 disabled:opacity-40 disabled:pointer-events-none transition"
                >
                  Próxima
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE LIVE SHOP LAYOUT PREVIEW & EDITOR */}
      {activeTab === "preview" && (
        <div className="bg-paper border border-line rounded-2xl p-6 lg:p-8 space-y-12 shadow-sm relative overflow-hidden">
          
          {/* Simulated Store Header */}
          <div className="border-b border-line pb-4 flex items-center justify-between opacity-60 pointer-events-none">
            <span className="text-xs tracking-tight text-ink font-semibold">Visualização Interativa da Loja</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>

          {/* 1. HERO SECTION */}
          <section className="relative py-10 border-b border-line group-hover:bg-neutral-50/50 rounded p-4">
            <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-dim mb-4">
              <span>01</span>
              <span className="h-px w-6 bg-ink/30" />
              LOJA INTELIGENTE
            </div>
            
            <h1 className="text-3xl md:text-5xl font-light text-ink leading-tight tracking-tight max-w-3xl">
              {heroTitle || "Título da Loja"}
            </h1>
            <p className="mt-4 max-w-xl text-xs md:text-[14px] text-dim leading-relaxed">
              {heroDescription || "Subtítulo descritivo da loja..."}
            </p>
            <div className="mt-6 flex gap-2">
              <button type="button" onClick={() => setIsLayoutSettingsOpen(true)} className="h-9 px-4 rounded-full border border-line text-xs font-semibold uppercase tracking-wider hover:border-ink text-ink bg-soft/50 transition">
                Editar Hero / Banner
              </button>
            </div>
          </section>

          {/* 2. DYNAMIC BANNER */}
          {bannerUrl && (
            <div className="relative aspect-[3/1] md:aspect-[5/1] rounded-2xl overflow-hidden border border-line bg-soft group">
              <img src={bannerUrl} alt="Banner" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/60 to-transparent flex flex-col justify-center px-8 text-paper">
                <h3 className="text-lg md:text-2xl font-light max-w-md">{bannerText}</h3>
              </div>
              <button 
                onClick={() => setIsLayoutSettingsOpen(true)}
                className="absolute top-4 right-4 bg-paper/95 text-ink text-[11px] font-semibold border border-line px-3.5 py-1.5 rounded-full uppercase tracking-wider hover:bg-paper transition shadow-md"
              >
                Configurar Banner
              </button>
            </div>
          )}

          {/* 3. FEATURED PRODUCTS (DESTAQUES) */}
          {featured.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <SectionLabel index="02" title="Destaques" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featured.map((p) => (
                  <PreviewProductCard key={p.slug} product={p} onEdit={handleEditOpen} onDelete={setProductToDelete} onMove={handleMoveOrder} />
                ))}
              </div>
            </section>
          )}

          {/* 4. CATEGORIES SECTION */}
          <section className="py-6 border-t border-line space-y-6">
            <SectionLabel index="03" title="Mapeamento de Categorias" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CATEGORIES.map((c) => {
                const count = listProductsSync(products, { categoryId: c.id }).length;
                return (
                  <div key={c.id} className="p-5 rounded-2xl border border-line bg-soft/30 flex flex-col justify-between min-h-[140px]">
                    <div>
                      <div className="text-[10px] tracking-[0.2em] uppercase text-dim">{count} itens</div>
                      <h4 className="mt-1.5 text-base font-semibold text-ink">{c.name}</h4>
                    </div>
                    <button
                      onClick={() => handleCreateOpen(c.id)}
                      className="mt-4 self-start inline-flex items-center gap-1.5 text-[11px] tracking-wider uppercase font-semibold text-ink hover:underline"
                    >
                      <Plus className="h-3.5 w-3.5" /> Novo item
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5. SECTIONS PER CATEGORY */}
          <section className="border-t border-line pt-10 space-y-16">
            {CATEGORIES.map((c) => {
              const categoryItems = listProductsSync(products, { categoryId: c.id });
              return (
                <div key={c.id} className="space-y-6">
                  <div className="flex items-end justify-between border-b border-line pb-3">
                    <div>
                      <span className="text-[10px] tracking-[0.2em] uppercase text-dim">Categoria</span>
                      <h3 className="text-xl md:text-2xl font-light text-ink mt-0.5">{c.name}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-dim font-medium">{categoryItems.length} itens</span>
                      <button
                        onClick={() => handleCreateOpen(c.id)}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-line text-[11px] font-semibold uppercase tracking-wider text-ink hover:bg-soft transition"
                      >
                        <Plus className="h-3.5 w-3.5" /> Cadastrar nesta Categoria
                      </button>
                    </div>
                  </div>

                  {categoryItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryItems.map((p) => (
                        <PreviewProductCard key={p.slug} product={p} onEdit={handleEditOpen} onDelete={setProductToDelete} onMove={handleMoveOrder} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 border border-dashed border-line rounded-xl text-center text-dim text-xs">
                      Nenhum produto cadastrado nesta categoria.
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        </div>
      )}

      {/* CREATE / EDIT FORM SLIDE OVER DRAWER */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end font-sans">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          <div className="relative w-full max-w-2xl bg-paper border-l border-line h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-right duration-350 text-ink">
            {/* Form Header */}
            <div className="h-16 md:h-20 border-b border-line px-6 flex items-center justify-between bg-soft/50 shrink-0">
              <div>
                <h2 className="text-base font-semibold text-ink">
                  {editingProduct ? "Editar Produto" : "Novo Produto"}
                </h2>
                <p className="text-[10px] text-dim mt-0.5">Preencha os campos para atualizar os produtos digitais da loja.</p>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-line hover:border-ink/40 text-dim hover:text-ink transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-ink">
              
              {/* SECTION: BASIC INFO */}
              <div className="space-y-4">
                <h3 className="text-[11px] uppercase tracking-wider text-dim font-bold border-b border-line pb-2">1. Dados Principais</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold">Nome do Produto *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ex: Template Social Media"
                      className="w-full h-10 bg-soft border border-line rounded-xl px-3 text-xs text-ink focus:border-ink/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold flex items-center justify-between">
                      <span>Slug *</span>
                      {!editingProduct && <span className="text-[9px] text-dim/60 font-mono">(auto-gerado)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                      placeholder="ex-template-social-media"
                      className="w-full h-10 bg-soft border border-line rounded-xl px-3 text-xs text-ink focus:border-ink/50 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold">Categoria</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full h-10 bg-soft border border-line rounded-xl px-3 text-xs text-ink focus:border-ink/50 focus:outline-none"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold">Tipo</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as ProductType)}
                      className="w-full h-10 bg-soft border border-line rounded-xl px-3 text-xs text-ink focus:border-ink/50 focus:outline-none"
                    >
                      <option value="digital">Produto Digital</option>
                      <option value="licenca">Licença de Software</option>
                      <option value="servico">Serviço</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as ProductStatus)}
                      className="w-full h-10 bg-soft border border-line rounded-xl px-3 text-xs text-ink focus:border-ink/50 focus:outline-none"
                    >
                      <option value="publicado">Ativo (Publicado)</option>
                      <option value="rascunho">Rascunho</option>
                      <option value="oculto">Oculto</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold">Descrição Curta *</label>
                  <input
                    type="text"
                    required
                    value={formShortDesc}
                    onChange={(e) => setFormShortDesc(e.target.value)}
                    placeholder="Resumo editorial de 1 linha..."
                    className="w-full h-10 bg-soft border border-line rounded-xl px-3 text-xs text-ink focus:border-ink/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold">Descrição Completa *</label>
                  <textarea
                    required
                    rows={4}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Descrição completa do produto. Aceita parágrafos..."
                    className="w-full bg-soft border border-line rounded-xl p-3 text-xs text-ink focus:border-ink/50 focus:outline-none font-sans leading-relaxed"
                  />
                </div>
              </div>

              {/* SECTION: PRICING & PROMOTION */}
              <div className="space-y-4">
                <h3 className="text-[11px] uppercase tracking-wider text-dim font-bold border-b border-line pb-2">2. Preço e Exibição</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold">Preço Normal (R$) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="Ex: 299.00"
                      className="w-full h-10 bg-soft border border-line rounded-xl px-3 text-xs text-ink focus:border-ink/50 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold">Preço Promocional (R$ - Opcional)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formPromoPrice}
                      onChange={(e) => setFormPromoPrice(e.target.value)}
                      placeholder="Ex: 199.00"
                      className="w-full h-10 bg-soft border border-line rounded-xl px-3 text-xs text-ink focus:border-ink/50 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold">Etiqueta/Badge</label>
                    <input
                      type="text"
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      placeholder="Ex: Novo, Destaque"
                      className="w-full h-10 bg-soft border border-line rounded-xl px-3 text-xs text-ink focus:border-ink/50 focus:outline-none"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 h-10 mt-5 pl-2">
                    <input
                      id="feat"
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="h-4 w-4 bg-soft border-line rounded text-ink focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="feat" className="text-xs font-medium text-ink cursor-pointer select-none">Exibir em Destaques</label>
                  </div>

                  <div className="flex items-center gap-2 h-10 mt-5 pl-2">
                    <input
                      id="bestsell"
                      type="checkbox"
                      checked={formBestSeller}
                      onChange={(e) => setFormBestSeller(e.target.checked)}
                      className="h-4 w-4 bg-soft border-line rounded text-ink focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="bestsell" className="text-xs font-medium text-ink cursor-pointer select-none">Mais Vendido</label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold">Posição de Ordenação</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formDisplayOrder}
                      onChange={(e) => setFormDisplayOrder(e.target.value)}
                      className="w-full h-10 bg-soft border border-line rounded-xl px-3 text-xs text-ink focus:border-ink/50 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: IMAGES & BANNERS */}
              <div className="space-y-4">
                <h3 className="text-[11px] uppercase tracking-wider text-dim font-bold border-b border-line pb-2">3. Mídia e Integrações</h3>
                
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold">URL da Imagem de Capa *</label>
                  <input
                    type="url"
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full h-10 bg-soft border border-line rounded-xl px-3 text-xs text-ink focus:border-ink/50 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold">Galeria de Imagens (Uma URL por linha)</label>
                  <textarea
                    rows={3}
                    value={formGallery}
                    onChange={(e) => setFormGallery(e.target.value)}
                    placeholder="https://exemplo.com/foto1.jpg&#10;https://exemplo.com/foto2.jpg"
                    className="w-full bg-soft border border-line rounded-xl p-3 text-xs text-ink focus:border-ink/50 focus:outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold">URL de Checkout Externo (Opcional)</label>
                    <input
                      type="url"
                      value={formPurchaseUrl}
                      onChange={(e) => setFormPurchaseUrl(e.target.value)}
                      placeholder="https://stripe.com/checkout/..."
                      className="w-full h-10 bg-soft border border-line rounded-xl px-3 text-xs text-ink focus:border-ink/50 focus:outline-none font-mono"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold">URL de Demonstração/Preview (Opcional)</label>
                    <input
                      type="url"
                      value={formDemoUrl}
                      onChange={(e) => setFormDemoUrl(e.target.value)}
                      placeholder="https://site-demonstracao.com"
                      className="w-full h-10 bg-soft border border-line rounded-xl px-3 text-xs text-ink focus:border-ink/50 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: SPECIFICS (LICENSES, FILES, DELIVERY) */}
              <div className="space-y-4">
                <h3 className="text-[11px] uppercase tracking-wider text-dim font-bold border-b border-line pb-2">4. Especificações Extras</h3>
                
                {formType === "licenca" && (
                  <div className="grid grid-cols-2 gap-4 border border-line p-4 rounded-xl bg-soft/50">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold">Validade da Licença *</label>
                      <input
                        type="text"
                        required
                        value={formLicDuration}
                        onChange={(e) => setFormLicDuration(e.target.value)}
                        placeholder="Ex: Anual, Vitalício"
                        className="w-full h-10 bg-soft border border-line rounded-xl px-3 text-xs text-ink"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold">Versão Atual</label>
                      <input
                        type="text"
                        value={formLicVersion}
                        onChange={(e) => setFormLicVersion(e.target.value)}
                        placeholder="Ex: 1.0.0"
                        className="w-full h-10 bg-soft border border-line rounded-xl px-3 text-xs text-ink font-mono"
                      />
                    </div>
                  </div>
                )}

                {formType === "servico" && (
                  <div className="border border-line p-4 rounded-xl bg-soft/50">
                    <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold">Tempo de Entrega *</label>
                    <input
                      type="text"
                      required
                      value={formDeliveryTime}
                      onChange={(e) => setFormDeliveryTime(e.target.value)}
                      placeholder="Ex: 7 a 10 dias úteis"
                      className="w-full h-10 bg-soft border border-line rounded-xl px-3 text-xs text-ink"
                    />
                  </div>
                )}

                {formType === "digital" && (
                  <div className="border border-line p-4 rounded-xl bg-soft/50">
                    <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold flex items-center justify-between">
                      <span>Lista de Arquivos (Nome,Tamanho por linha)</span>
                      <span className="text-[9px] text-dim/60 font-mono">Ex: manual.pdf,2 MB</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formFilesList}
                      onChange={(e) => setFormFilesList(e.target.value)}
                      placeholder="arquivos-projeto.zip,120 MB"
                      className="w-full bg-soft border border-line rounded-xl p-3 text-xs text-ink font-mono"
                    />
                  </div>
                )}
              </div>

              {/* SECTION: SEO */}
              <div className="space-y-4">
                <h3 className="text-[11px] uppercase tracking-wider text-dim font-bold border-b border-line pb-2">5. Tags SEO (Metas Google)</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold">Meta Título (Title)</label>
                    <input
                      type="text"
                      value={formSeoTitle}
                      onChange={(e) => setFormSeoTitle(e.target.value)}
                      placeholder="Meta title para indexação..."
                      className="w-full h-10 bg-soft border border-line rounded-xl px-3 text-xs text-ink focus:border-ink/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-dim mb-1.5 font-semibold">Meta Descrição (Description)</label>
                    <input
                      type="text"
                      value={formSeoDesc}
                      onChange={(e) => setFormSeoDesc(e.target.value)}
                      placeholder="Resumo SEO curto..."
                      className="w-full h-10 bg-soft border border-line rounded-xl px-3 text-xs text-ink focus:border-ink/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-6 border-t border-line flex items-center justify-end gap-3 shrink-0 bg-paper">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="h-10 px-5 rounded-full border border-line hover:bg-soft text-[12px] uppercase font-semibold text-ink transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-6 rounded-full bg-ink text-paper text-[12px] uppercase font-bold hover:bg-ink/90 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</>
                  ) : (
                    <>Salvar Alterações</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 font-sans">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setProductToDelete(null)} />
          <div className="relative w-full max-w-md bg-paper border border-line p-6 rounded-2xl shadow-2xl space-y-6 z-10 text-xs text-ink">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-ink">Excluir Produto?</h3>
                <p className="text-dim leading-relaxed">
                  Tem certeza que deseja excluir <strong>{productToDelete.name}</strong>? Esta ação é definitiva e removerá o item da loja pública.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="h-9 px-4 rounded-full border border-line bg-paper text-ink font-semibold transition hover:bg-soft"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="h-9 px-4 rounded-full bg-red-600 hover:bg-red-500 text-paper font-semibold transition"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// SIMULATED PRODUCT CARD FOR LIVE VIEW EDITOR MODE
interface PreviewProductCardProps {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
  onMove: (p: Product, direction: "up" | "down") => void;
}

function PreviewProductCard({ product, onEdit, onDelete, onMove }: PreviewProductCardProps) {
  const hasPromo = product.promoPrice && product.promoPrice > 0;
  
  return (
    <div className="group relative flex flex-col bg-paper border border-line rounded-2xl overflow-hidden hover:border-ink/40 transition-all select-none">
      
      {/* Editor overlay dashboard */}
      <div className="absolute inset-0 bg-paper/95 opacity-0 group-hover:opacity-100 z-30 transition-all duration-300 flex flex-col items-center justify-center p-4 gap-3 text-center border-2 border-dashed border-ink/40 rounded-2xl">
        <span className="text-[10px] font-bold uppercase tracking-wider text-ink/70">Ações de Layout</span>
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(product)}
            className="inline-flex h-9 items-center gap-1.5 px-3 rounded-full bg-ink text-paper text-[10px] uppercase tracking-wider font-bold hover:bg-ink/90 transition shadow"
          >
            <Edit className="h-3 w-3" /> Editar
          </button>
          <button 
            onClick={() => onDelete(product)}
            className="inline-flex h-9 items-center justify-center h-9 w-9 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        
        {/* Reordering helper buttons */}
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-line w-full justify-center">
          <span className="text-[9px] uppercase font-bold text-dim font-mono">Ordem ({product.displayOrder || 0})</span>
          <button onClick={() => onMove(product, "up")} className="p-1 hover:text-ink text-dim transition-colors" title="Mover para cima"><ChevronUp className="h-4 w-4" /></button>
          <button onClick={() => onMove(product, "down")} className="p-1 hover:text-ink text-dim transition-colors" title="Mover para baixo"><ChevronDown className="h-4 w-4" /></button>
        </div>
      </div>

      {/* Main card representation */}
      <div className="relative aspect-[4/3] bg-soft overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <span className="text-[10px] tracking-[0.2em] uppercase bg-ink text-paper px-2.5 py-0.5 rounded-full">
            {typeLabel(product.type)}
          </span>
          {product.badge && (
            <span className="text-[10px] tracking-[0.15em] uppercase bg-paper border border-line text-ink px-2 py-0.5 rounded-full font-medium">
              {product.badge}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex flex-col gap-2 p-5 flex-1 bg-paper">
        <h3 className="text-[14px] font-semibold text-ink leading-snug">{product.name}</h3>
        <p className="text-[12px] text-dim line-clamp-2">{product.shortDescription}</p>
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-soft">
          <div className="flex items-baseline gap-1.5 font-mono">
            {hasPromo ? (
              <>
                <span className="text-[14px] font-bold text-ink">{formatBRL(product.promoPrice!)}</span>
                <span className="text-[11px] text-dim line-through">{formatBRL(product.price)}</span>
              </>
            ) : (
              <span className="text-[14px] font-bold text-ink">{formatBRL(product.price)}</span>
            )}
          </div>
          <span className="text-[9px] uppercase tracking-wider text-dim bg-soft border border-line px-2.5 py-0.5 rounded-full font-medium">
            {product.status === "publicado" ? "Ativo" : "Inativo"}
          </span>
        </div>
      </div>
    </div>
  );
}

// SECTION LABEL UTILITY
function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-dim mb-4 font-bold select-none">
      <span>{index}</span>
      <span className="h-px w-6 bg-line" />
      {title}
    </div>
  );
}
