import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { addLine, cartCount, type CartLine } from "@/domain/cart";
import {
  defaultColor,
  defaultSize,
  filterRelatedProducts,
  isProductVisible,
  type Category,
  type Size,
} from "@/domain/product";
import type { Catalog } from "@/domain/product";
import { fixtureCatalog } from "@/infrastructure/fixture/fixtureCatalog";
import { ProductScreen } from "@/presentation/ProductScreen";
import { theme } from "@/presentation/theme";

export function ProductScreenContainer() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [category, setCategory] = useState<Category>("MEN");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fixtureCatalog.getCatalog().then((next) => {
      if (!active) {
        return;
      }
      setCatalog(next);
      setSelectedSize(defaultSize(next.product.sizes));
      setSelectedColorId(defaultColor(next.product.colors)?.id ?? null);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!catalog) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={theme.color.text} />
      </View>
    );
  }

  const product = catalog.product;

  return (
    <ProductScreen
      cartCount={cartCount(cart)}
      category={category}
      lightboxImageUrl={lightboxImageUrl}
      lightboxOpen={lightboxOpen}
      onAddToBag={() => {
        if (!selectedSize || !selectedColorId) {
          return;
        }
        setCart((current) =>
          addLine(current, {
            productId: product.id,
            size: selectedSize,
            colorId: selectedColorId,
          }),
        );
      }}
      onCategoryChange={setCategory}
      onCloseLightbox={() => {
        setLightboxOpen(false);
        setLightboxImageUrl(null);
      }}
      onColorChange={setSelectedColorId}
      onLogoPress={() => {
        setCategory("MEN");
        setSearchQuery("");
        setLightboxOpen(false);
        setLightboxImageUrl(null);
      }}
      onOpenImage={(imageUrl) => {
        setLightboxImageUrl(imageUrl);
        setLightboxOpen(true);
      }}
      onSearchChange={(value) => setSearchQuery(value.trim())}
      onSizeChange={setSelectedSize}
      product={product}
      productVisible={isProductVisible(category, product.category)}
      relatedProducts={filterRelatedProducts(catalog.relatedProducts, searchQuery)}
      searchQuery={searchQuery}
      selectedColorId={selectedColorId}
      selectedSize={selectedSize}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: "center",
    backgroundColor: theme.color.background,
    flex: 1,
    justifyContent: "center",
  },
});
