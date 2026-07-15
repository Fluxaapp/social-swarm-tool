import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { 
  Plus, Search, Edit, Trash2, ArrowUpDown, Loader2, X, AlertTriangle, Eye, ArrowUpRight, Copy
} from "lucide-react";
import { toast } from "sonner";
import { 
  getProducts, saveProduct, deleteProduct, formatBRL, CATEGORIES, typeLabel, type Product, type ProductType, type ProductStatus
} from "@/lib/shop/products";

export const Route = createFileRoute("/admin/products")({
  loader: async () => {
    try {
      const products = await getProducts();
      return { products: products || [] };
    } catch (error) {
      console.error("Error loading products in admin products loader", error);
      return { products: [] };
    }
  },
  component: AdminProducts,
});

function AdminProducts() {
  const { products: initialProducts } = Route.useLoaderData();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  // Open Form for Create
  const handleCreateOpen = () => {
    setEditingProduct(null);
    setFormName("");
    setFormSlug("");
    setFormShortDesc("");
    setFormDesc("");
    setFormCategory(CATEGORIES[0].id);
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
    
    // Parse gallery list
    const galleryArr = formGallery
      .split("\n")
      .map(url => url.trim())
      .filter(url => url.length > 0);

    // Parse files list
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
      // Reload router data
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

  // Toggle sorting
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

  // Paginated lists
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-100 tracking-tight">Produtos da Loja</h1>
          <p className="text-xs text-neutral-500 mt-1">Gerencie os produtos digitais, licenças e serviços exibidos em sua loja.</p>
        </div>
        <div>
          <button
            onClick={handleCreateOpen}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-neutral-100 text-neutral-950 font-medium text-[13px] hover:bg-neutral-200 transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" /> Novo Produto
          </button>
        </div>
      </div>

      {/* Filters toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-neutral-900/30 p-4 border border-neutral-800 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600 pointer-events-none" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, slug ou descrição..."
            className="w-full h-10 bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 text-xs text-neutral-200 placeholder:text-neutral-600 focus:border-neutral-700 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">Categoria</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 bg-neutral-950 border border-neutral-800 rounded-lg px-3 text-xs text-neutral-300 focus:border-neutral-700 focus:outline-none"
            >
              <option value="all">Todas as Categorias</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">Status</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 bg-neutral-950 border border-neutral-800 rounded-lg px-3 text-xs text-neutral-300 focus:border-neutral-700 focus:outline-none"
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
      <div className="bg-neutral-900/20 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/40 text-[10px] uppercase tracking-wider text-neutral-500 font-semibold select-none">
                <th className="py-4.5 px-6">Produto</th>
                <th className="py-4.5 px-4 cursor-pointer hover:text-neutral-300 transition-colors" onClick={() => handleSort("order")}>
                  <span className="flex items-center gap-1">Ordem <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="py-4.5 px-4">Categoria</th>
                <th className="py-4.5 px-4 cursor-pointer hover:text-neutral-300 transition-colors" onClick={() => handleSort("price")}>
                  <span className="flex items-center gap-1">Preço <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="py-4.5 px-4">Destaque</th>
                <th className="py-4.5 px-4 text-center">Status</th>
                <th className="py-4.5 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/40">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => {
                  const hasPromo = p.promoPrice && p.promoPrice > 0;
                  return (
                    <tr key={p.slug} className="hover:bg-neutral-900/10 transition-colors">
                      {/* Name/Image info */}
                      <td className="py-4 px-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded bg-neutral-800 border border-neutral-700/30 overflow-hidden shrink-0">
                          <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="block font-medium text-neutral-200 truncate max-w-[200px]">{p.name}</span>
                          <span className="block text-[10px] text-neutral-500 mt-1 truncate max-w-[200px]">{p.slug}</span>
                        </div>
                      </td>
                      
                      {/* Order */}
                      <td className="py-4 px-4 text-neutral-400 font-medium font-mono">
                        {p.displayOrder ?? 0}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 text-neutral-400 font-medium">
                        {CATEGORIES.find(c => c.id === p.categoryId)?.name || p.categoryId}
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 text-neutral-300 font-medium font-mono">
                        {hasPromo ? (
                          <div className="space-y-0.5">
                            <span className="block text-neutral-100">{formatBRL(p.promoPrice!)}</span>
                            <span className="block text-[10px] text-neutral-500 line-through">{formatBRL(p.price)}</span>
                          </div>
                        ) : (
                          <span>{formatBRL(p.price)}</span>
                        )}
                      </td>

                      {/* Featured */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium ${
                          p.featured 
                            ? "bg-indigo-950/20 border border-indigo-900/40 text-indigo-400" 
                            : "text-neutral-600 bg-neutral-900/50"
                        }`}>
                          {p.featured ? "Destaque" : "Normal"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                          p.status === "publicado"
                            ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-400"
                            : p.status === "rascunho"
                            ? "bg-amber-950/20 border-amber-900/40 text-amber-400"
                            : "bg-neutral-800 border-neutral-700/60 text-neutral-400"
                        }`}>
                          {p.status === "publicado" ? "Ativo" : p.status === "rascunho" ? "Rascunho" : "Oculto"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right space-x-2">
                        <a
                          href={`/loja/produto/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 w-8 items-center justify-center rounded border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 transition"
                          title="Visualizar na loja"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </a>
                        <button
                          onClick={() => handleEditOpen(p)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 transition"
                          title="Editar"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setProductToDelete(p)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded border border-red-950 text-red-500 hover:text-red-400 hover:bg-red-950/20 transition"
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
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    Nenhum produto atende aos critérios de busca ou filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-neutral-900/40 border-t border-neutral-800 px-6 py-4 flex items-center justify-between text-xs">
          <div className="text-neutral-500">
            Mostrando de <span className="text-neutral-300 font-mono">{(currentPage - 1) * itemsPerPage + 1}</span> a{" "}
            <span className="text-neutral-300 font-mono">
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
            </span>{" "}
            de <span className="text-neutral-300 font-mono">{filteredProducts.length}</span> produtos.
          </div>
          <div className="flex items-center gap-2 select-none">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 px-3 rounded border border-neutral-800 hover:bg-neutral-850 hover:text-neutral-100 disabled:pointer-events-none disabled:opacity-40 transition-colors"
            >
              Anterior
            </button>
            <span className="text-neutral-400 font-medium">
              Página <span className="text-neutral-300 font-mono">{currentPage}</span> de{" "}
              <span className="text-neutral-300 font-mono">{totalPages}</span>
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 px-3 rounded border border-neutral-800 hover:bg-neutral-850 hover:text-neutral-100 disabled:pointer-events-none disabled:opacity-40 transition-colors"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

      {/* CRUD SLIDE OUT DRAWER / FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end font-sans">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsFormOpen(false)}
          />
          
          {/* Drawer content */}
          <div className="relative w-full max-w-2xl bg-neutral-950 border-l border-neutral-850 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-right duration-350">
            {/* Header */}
            <div className="h-16 border-b border-neutral-800 px-6 flex items-center justify-between bg-neutral-900/30 shrink-0">
              <div>
                <h2 className="text-[15px] font-semibold text-neutral-100">
                  {editingProduct ? "Editar Produto" : "Criar Novo Produto"}
                </h2>
                <p className="text-[10px] text-neutral-500 mt-0.5">Preencha todos os campos necessários.</p>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="h-8 w-8 inline-flex items-center justify-center rounded border border-neutral-850 hover:border-neutral-700 text-neutral-400 hover:text-neutral-250 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-neutral-300">
              {/* SECTION: BASIC INFO */}
              <div className="space-y-4">
                <h3 className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold border-b border-neutral-800 pb-2">Informações Básicas</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">Nome do Produto *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ex: Template Pitch Deck"
                      className="w-full h-10 bg-neutral-900 border border-neutral-800 rounded-lg px-3 text-xs text-neutral-200 focus:border-neutral-600 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium flex items-center justify-between">
                      <span>Slug *</span>
                      {!editingProduct && <span className="text-[9px] text-neutral-600 lowercase">(auto-gerado)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                      placeholder="ex-template-pitch-deck"
                      className="w-full h-10 bg-neutral-900 border border-neutral-800 rounded-lg px-3 text-xs text-neutral-200 focus:border-neutral-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">Categoria</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full h-10 bg-neutral-900 border border-neutral-800 rounded-lg px-3 text-xs text-neutral-200 focus:border-neutral-600 focus:outline-none"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">Tipo</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as ProductType)}
                      className="w-full h-10 bg-neutral-900 border border-neutral-800 rounded-lg px-3 text-xs text-neutral-200 focus:border-neutral-600 focus:outline-none"
                    >
                      <option value="digital">Produto Digital</option>
                      <option value="licenca">Licença de Software</option>
                      <option value="servico">Serviço</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as ProductStatus)}
                      className="w-full h-10 bg-neutral-900 border border-neutral-800 rounded-lg px-3 text-xs text-neutral-200 focus:border-neutral-600 focus:outline-none"
                    >
                      <option value="publicado">Ativo (Publicado)</option>
                      <option value="rascunho">Rascunho</option>
                      <option value="oculto">Oculto</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">Descrição Curta *</label>
                  <input
                    type="text"
                    required
                    value={formShortDesc}
                    onChange={(e) => setFormShortDesc(e.target.value)}
                    placeholder="Resumo de 1 linha que aparece no card..."
                    className="w-full h-10 bg-neutral-900 border border-neutral-800 rounded-lg px-3 text-xs text-neutral-200 focus:border-neutral-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">Descrição Completa *</label>
                  <textarea
                    required
                    rows={4}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Descrição detalhada do produto. Suporta quebras de linha..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-200 focus:border-neutral-600 focus:outline-none transition-colors resize-y font-sans leading-relaxed"
                  />
                </div>
              </div>

              {/* SECTION: PRICING & PROMOTION */}
              <div className="space-y-4">
                <h3 className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold border-b border-neutral-800 pb-2">Preço e Destaques</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">Preço Normal (R$) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="Ex: 249.00"
                      className="w-full h-10 bg-neutral-900 border border-neutral-800 rounded-lg px-3 text-xs text-neutral-250 focus:border-neutral-600 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">Preço Promocional (R$ - Opcional)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formPromoPrice}
                      onChange={(e) => setFormPromoPrice(e.target.value)}
                      placeholder="Ex: 199.00"
                      className="w-full h-10 bg-neutral-900 border border-neutral-800 rounded-lg px-3 text-xs text-neutral-250 focus:border-neutral-600 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">Badge da Loja</label>
                    <input
                      type="text"
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      placeholder="Ex: Novo, Promoção, 30% OFF"
                      className="w-full h-10 bg-neutral-900 border border-neutral-800 rounded-lg px-3 text-xs text-neutral-200 focus:border-neutral-600 focus:outline-none"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 h-10 mt-5 pl-2">
                    <input
                      id="feat"
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="h-4 w-4 bg-neutral-900 border-neutral-800 rounded text-indigo-500 focus:ring-0"
                    />
                    <label htmlFor="feat" className="text-[11px] font-medium text-neutral-300 cursor-pointer select-none">Produto em Destaque</label>
                  </div>

                  <div className="flex items-center gap-2 h-10 mt-5 pl-2">
                    <input
                      id="bestsell"
                      type="checkbox"
                      checked={formBestSeller}
                      onChange={(e) => setFormBestSeller(e.target.checked)}
                      className="h-4 w-4 bg-neutral-900 border-neutral-800 rounded text-indigo-500 focus:ring-0"
                    />
                    <label htmlFor="bestsell" className="text-[11px] font-medium text-neutral-300 cursor-pointer select-none">Mais Vendido</label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">Ordem de Exibição</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formDisplayOrder}
                      onChange={(e) => setFormDisplayOrder(e.target.value)}
                      className="w-full h-10 bg-neutral-900 border border-neutral-800 rounded-lg px-3 text-xs text-neutral-200 focus:border-neutral-600 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: IMAGES & MEDIA */}
              <div className="space-y-4">
                <h3 className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold border-b border-neutral-800 pb-2">Mídia e URLs</h3>
                
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">URL da Imagem Principal *</label>
                  <input
                    type="url"
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full h-10 bg-neutral-900 border border-neutral-800 rounded-lg px-3 text-xs text-neutral-200 focus:border-neutral-600 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">Galeria de Imagens (Opcional - Uma URL por linha)</label>
                  <textarea
                    rows={3}
                    value={formGallery}
                    onChange={(e) => setFormGallery(e.target.value)}
                    placeholder="https://exemplo.com/imagem1.jpg&#10;https://exemplo.com/imagem2.jpg"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-250 focus:border-neutral-600 focus:outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">Botão de Compra Externo (URL - Opcional)</label>
                    <input
                      type="url"
                      value={formPurchaseUrl}
                      onChange={(e) => setFormPurchaseUrl(e.target.value)}
                      placeholder="https://checkout.exemplo.com/..."
                      className="w-full h-10 bg-neutral-900 border border-neutral-800 rounded-lg px-3 text-xs text-neutral-200 focus:border-neutral-600 focus:outline-none font-mono"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">Botão de Demonstração (URL - Opcional)</label>
                    <input
                      type="url"
                      value={formDemoUrl}
                      onChange={(e) => setFormDemoUrl(e.target.value)}
                      placeholder="https://demo.exemplo.com"
                      className="w-full h-10 bg-neutral-900 border border-neutral-800 rounded-lg px-3 text-xs text-neutral-200 focus:border-neutral-600 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: SPECIFICS (LICENSES, FILES, DELIVERY) */}
              <div className="space-y-4">
                <h3 className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold border-b border-neutral-800 pb-2">Detalhes de Licença, Arquivos ou Prazos</h3>
                
                {formType === "licenca" && (
                  <div className="grid grid-cols-2 gap-4 border border-neutral-850 p-4 rounded-xl bg-neutral-900/10">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">Duração da Licença *</label>
                      <input
                        type="text"
                        required
                        value={formLicDuration}
                        onChange={(e) => setFormLicDuration(e.target.value)}
                        placeholder="Ex: 12 meses, Vitalícia"
                        className="w-full h-10 bg-neutral-900 border border-neutral-800 rounded-lg px-3 text-xs text-neutral-200 focus:border-neutral-600 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">Versão</label>
                      <input
                        type="text"
                        value={formLicVersion}
                        onChange={(e) => setFormLicVersion(e.target.value)}
                        placeholder="Ex: 2.4.0"
                        className="w-full h-10 bg-neutral-900 border border-neutral-800 rounded-lg px-3 text-xs text-neutral-200 focus:border-neutral-600 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                )}

                {formType === "servico" && (
                  <div className="border border-neutral-850 p-4 rounded-xl bg-neutral-900/10">
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">Prazo de Entrega *</label>
                    <input
                      type="text"
                      required
                      value={formDeliveryTime}
                      onChange={(e) => setFormDeliveryTime(e.target.value)}
                      placeholder="Ex: 15 dias úteis, 3 semanas"
                      className="w-full h-10 bg-neutral-900 border border-neutral-800 rounded-lg px-3 text-xs text-neutral-200 focus:border-neutral-600 focus:outline-none"
                    />
                  </div>
                )}

                {formType === "digital" && (
                  <div className="border border-neutral-850 p-4 rounded-xl bg-neutral-900/10 space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium flex items-center justify-between">
                        <span>Lista de Arquivos (Opcional - Nome,Tamanho por linha)</span>
                        <span className="text-[9px] text-neutral-500 font-mono">Ex: deck-slides.zip,42 MB</span>
                      </label>
                      <textarea
                        rows={2}
                        value={formFilesList}
                        onChange={(e) => setFormFilesList(e.target.value)}
                        placeholder="pitch-deck-templates.fig,24 MB&#10;pitch-deck-slides.key,18 MB"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-250 focus:border-neutral-600 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: SEO */}
              <div className="space-y-4">
                <h3 className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold border-b border-neutral-800 pb-2">Otimização SEO</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">Título SEO</label>
                    <input
                      type="text"
                      value={formSeoTitle}
                      onChange={(e) => setFormSeoTitle(e.target.value)}
                      placeholder="Título que aparece no Google..."
                      className="w-full h-10 bg-neutral-900 border border-neutral-800 rounded-lg px-3 text-xs text-neutral-200 focus:border-neutral-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">Descrição SEO</label>
                    <input
                      type="text"
                      value={formSeoDesc}
                      onChange={(e) => setFormSeoDesc(e.target.value)}
                      placeholder="Meta descrição para buscadores..."
                      className="w-full h-10 bg-neutral-900 border border-neutral-800 rounded-lg px-3 text-xs text-neutral-200 focus:border-neutral-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-6 border-t border-neutral-800 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="h-10 px-5 rounded-lg border border-neutral-800 hover:bg-neutral-900 font-medium text-[13px] transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-6 rounded-lg bg-neutral-100 text-neutral-950 font-semibold text-[13px] tracking-wide uppercase hover:bg-neutral-200 disabled:pointer-events-none disabled:opacity-40 transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</>
                  ) : (
                    <>Salvar Produto</>
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
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setProductToDelete(null)} />
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-2xl space-y-6 z-10 text-xs">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-red-950/40 border border-red-900/50 flex items-center justify-center text-red-500 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-[14px] font-semibold text-neutral-100">Excluir Produto?</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Tem certeza que deseja excluir o produto <strong>{productToDelete.name}</strong>? Esta ação é permanente e ele será imediatamente removido da loja.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={isSubmitting}
                className="h-9 px-4 rounded-lg border border-neutral-800 hover:bg-neutral-850 font-medium text-neutral-350 hover:text-neutral-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="h-9 px-4 rounded-lg bg-red-600 hover:bg-red-500 font-semibold text-neutral-100 transition-colors flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Excluindo...</>
                ) : (
                  <>Excluir</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
