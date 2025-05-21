"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ShoppingCart,
  Plus,
  Pencil,
  Trash2,
  Search,
  BarChart4,
  Package,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { mockProducts, mockSuppliers } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    costPrice: "",
    unit: "liter",
    category: "Milk",
    description: "",
    supplier: "",
    inStock: true,
    sku: "",
    barcode: "",
    minStock: "",
    currentStock: "",
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddProduct = () => {
    // Validate form
    if (!formData.name || !formData.price || !formData.supplier) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create new product
    const newProduct = {
      id: `prod${products.length + 1}`,
      ...formData,
      price: Number.parseFloat(formData.price),
      costPrice: Number.parseFloat(formData.costPrice),
      minStock: Number.parseInt(formData.minStock),
      currentStock: Number.parseInt(formData.currentStock),
      image: `/products/${formData.category.toLowerCase()}.jpg`,
    };

    setProducts([...products, newProduct]);
    setIsAddDialogOpen(false);
    toast.success("Product added successfully");

    // Reset form
    resetForm();
  };

  const handleEditProduct = () => {
    if (!selectedProduct) return;

    // Validate form
    if (!formData.name || !formData.price || !formData.supplier) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedProduct = {
      ...selectedProduct,
      ...formData,
      price: Number.parseFloat(formData.price),
      costPrice: Number.parseFloat(formData.costPrice),
      minStock: Number.parseInt(formData.minStock),
      currentStock: Number.parseInt(formData.currentStock),
    };

    setProducts(
      products.map((product) =>
        product.id === selectedProduct.id ? updatedProduct : product
      )
    );
    setIsEditDialogOpen(false);
    toast.success("Product updated successfully");
  };

  const handleDeleteProduct = () => {
    if (!selectedProduct) return;

    setProducts(
      products.filter((product) => product.id !== selectedProduct.id)
    );
    setIsDeleteDialogOpen(false);
    toast.success("Product deleted successfully");
  };

  const openEditDialog = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      costPrice: product.costPrice?.toString() || "",
      unit: product.unit,
      category: product.category,
      description: product.description,
      supplier: product.supplier,
      inStock: product.inStock,
      sku: product.sku || "",
      barcode: product.barcode || "",
      minStock: product.minStock?.toString() || "",
      currentStock: product.currentStock?.toString() || "",
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      costPrice: "",
      unit: "liter",
      category: "Milk",
      description: "",
      supplier: "",
      inStock: true,
      sku: "",
      barcode: "",
      minStock: "",
      currentStock: "",
    });
  };

  // Get unique categories
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Calculate statistics
  const totalProducts = products.length;
  const outOfStock = products.filter((p) => !p.inStock).length;
  const lowStock = products.filter(
    (p) => p.currentStock && p.minStock && p.currentStock <= p.minStock
  ).length;
  const totalValue = products.reduce(
    (sum, p) => sum + p.price * (p.currentStock || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your dairy products catalog
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Add a new product to your catalog.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleSelectChange("category", value)
                        }
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                          <SelectItem value="Milk">Milk</SelectItem>
                          <SelectItem value="Yogurt">Yogurt</SelectItem>
                          <SelectItem value="Cheese">Cheese</SelectItem>
                          <SelectItem value="Butter">Butter</SelectItem>
                          <SelectItem value="Cream">Cream</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Select
                        value={formData.unit}
                        onValueChange={(value) =>
                          handleSelectChange("unit", value)
                        }
                      >
                        <SelectTrigger id="unit">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="liter">Liter</SelectItem>
                          <SelectItem value="kg">Kilogram</SelectItem>
                          <SelectItem value="cup">Cup</SelectItem>
                          <SelectItem value="can">Can</SelectItem>
                          <SelectItem value="bottle">Bottle</SelectItem>
                          <SelectItem value="pack">Pack</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Supplier *</Label>
                      <Select
                        value={formData.supplier}
                        onValueChange={(value) =>
                          handleSelectChange("supplier", value)
                        }
                      >
                        <SelectTrigger id="supplier">
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockSuppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.name}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter product description"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="pricing" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Selling Price *</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Input
                          id="price"
                          name="price"
                          type="text"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="costPrice">Cost Price</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Input
                          id="costPrice"
                          name="costPrice"
                          type="text"
                          value={formData.costPrice}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Profit Margin</Label>
                    <div className="h-8 px-3 py-2 rounded-md border border-input bg-background text-sm">
                      {formData.price && formData.costPrice
                        ? `${(
                            ((Number.parseFloat(formData.price) -
                              Number.parseFloat(formData.costPrice)) /
                              Number.parseFloat(formData.price)) *
                            100
                          ).toFixed(2)}%`
                        : "N/A"}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="inventory" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        placeholder="Enter SKU"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="barcode">Barcode</Label>
                      <Input
                        id="barcode"
                        name="barcode"
                        value={formData.barcode}
                        onChange={handleInputChange}
                        placeholder="Enter barcode"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentStock">Current Stock</Label>
                      <Input
                        id="currentStock"
                        name="currentStock"
                        type="text"
                        value={formData.currentStock}
                        onChange={handleInputChange}
                        placeholder="Enter current stock"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minStock">Minimum Stock</Label>
                      <Input
                        id="minStock"
                        name="minStock"
                        type="text"
                        value={formData.minStock}
                        onChange={handleInputChange}
                        placeholder="Enter minimum stock"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="inStock"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="inStock">In Stock</Label>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bento Grid Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="blue-tint hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {totalProducts}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {categories.length} categories
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-gray-900 hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {lowStock}
            </div>
            <p className="text-xs text-muted-foreground">
              Below minimum threshold
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-gray-900 hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-red-500" />
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {outOfStock}
            </div>
            <p className="text-xs text-muted-foreground">Need to restock</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-gray-900 hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              Inventory Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              ${totalValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Total stock value</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
            >
              <Package className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              <BarChart4 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading products...</p>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="bento-grid">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="bento-grid-item blue-tint">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={
                        product.image || "/placeholder.svg?height=300&width=400"
                      }
                      alt={product.name}
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                    <Badge
                      variant={product.inStock ? "default" : "destructive"}
                      className="absolute right-2 top-2"
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                    {product.currentStock &&
                      product.minStock &&
                      product.currentStock <= product.minStock && (
                        <Badge
                          variant="outline"
                          className="absolute left-2 top-2 bg-amber-100 text-amber-800 border-amber-200"
                        >
                          Low Stock
                        </Badge>
                      )}
                  </div>
                  <CardContent className="p-4 card-content">
                    <div className="space-y-2">
                      <div className="flex-between">
                        <h3 className="text-lg font-semibold">
                          {product.name}
                        </h3>
                        <div className="font-bold">
                          ${product.price.toFixed(2)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex-between text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {product.category}
                          </Badge>
                          <span className="text-muted-foreground">
                            Per {product.unit}
                          </span>
                        </div>
                        <div className="text-muted-foreground">
                          {product.supplier}
                        </div>
                      </div>
                      {product.currentStock !== undefined && (
                        <div className="pt-2">
                          <div className="flex-between text-sm mb-1">
                            <span>Stock Level</span>
                            <span
                              className={
                                product.currentStock <= (product.minStock || 0)
                                  ? "text-amber-600"
                                  : "text-green-600"
                              }
                            >
                              {product.currentStock} {product.unit}s
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className={`h-full rounded-full ${
                                product.currentStock <= (product.minStock || 0)
                                  ? "bg-amber-500"
                                  : "bg-green-500"
                              }`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  (product.currentStock /
                                    (product.minStock * 3 || 100)) *
                                    100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                      <div className="flex-end gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                        >
                          <Pencil className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(product)}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="blue-tint">
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Product</th>
                        <th className="text-left p-3 font-medium">Category</th>
                        <th className="text-left p-3 font-medium">Price</th>
                        <th className="text-left p-3 font-medium">Stock</th>
                        <th className="text-left p-3 font-medium">Supplier</th>
                        <th className="text-right p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="border-t">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-md overflow-hidden">
                                <img
                                  src={
                                    product.image ||
                                    "/placeholder.svg?height=40&width=40"
                                  }
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {product.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {product.sku}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline">{product.category}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="font-medium">
                              ${product.price.toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              per {product.unit}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  product.inStock ? "default" : "destructive"
                                }
                                className={
                                  product.inStock ? "bg-green-500" : ""
                                }
                              >
                                {product.inStock ? "In Stock" : "Out of Stock"}
                              </Badge>
                              {product.currentStock !== undefined && (
                                <span className="text-sm">
                                  {product.currentStock} {product.unit}s
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3">{product.supplier}</td>
                          <td className="p-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(product)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDeleteDialog(product)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {filteredProducts.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-10 text-center border rounded-lg blue-tint">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No products found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to the product details.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid gap-4 py-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Product Name *</Label>
                      <Input
                        id="edit-name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleSelectChange("category", value)
                        }
                      >
                        <SelectTrigger id="edit-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-unit">Unit</Label>
                      <Select
                        value={formData.unit}
                        onValueChange={(value) =>
                          handleSelectChange("unit", value)
                        }
                      >
                        <SelectTrigger id="edit-unit">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="liter">Liter</SelectItem>
                          <SelectItem value="kg">Kilogram</SelectItem>
                          <SelectItem value="cup">Cup</SelectItem>
                          <SelectItem value="can">Can</SelectItem>
                          <SelectItem value="bottle">Bottle</SelectItem>
                          <SelectItem value="pack">Pack</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-supplier">Supplier *</Label>
                      <Select
                        value={formData.supplier}
                        onValueChange={(value) =>
                          handleSelectChange("supplier", value)
                        }
                      >
                        <SelectTrigger id="edit-supplier">
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockSuppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.name}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Input
                      id="edit-description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="pricing" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-price">Selling Price *</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Input
                          id="edit-price"
                          name="price"
                          type="text"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-costPrice">Cost Price</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Input
                          id="edit-costPrice"
                          name="costPrice"
                          type="text"
                          value={formData.costPrice}
                          onChange={handleInputChange}
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Profit Margin</Label>
                    <div className="h-8 px-3 py-2 rounded-md border border-input bg-background text-sm">
                      {formData.price && formData.costPrice
                        ? `${(
                            ((Number.parseFloat(formData.price) -
                              Number.parseFloat(formData.costPrice)) /
                              Number.parseFloat(formData.price)) *
                            100
                          ).toFixed(2)}%`
                        : "N/A"}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="inventory" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-sku">SKU</Label>
                      <Input
                        id="edit-sku"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-barcode">Barcode</Label>
                      <Input
                        id="edit-barcode"
                        name="barcode"
                        value={formData.barcode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-currentStock">Current Stock</Label>
                      <Input
                        id="edit-currentStock"
                        name="currentStock"
                        type="text"
                        value={formData.currentStock}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-minStock">Minimum Stock</Label>
                      <Input
                        id="edit-minStock"
                        name="minStock"
                        type="text"
                        value={formData.minStock}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="edit-inStock"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="edit-inStock">In Stock</Label>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="py-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-md">
                  <img
                    src={
                      selectedProduct.image ||
                      "/placeholder.svg?height=64&width=64"
                    }
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{selectedProduct.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedProduct.category}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
