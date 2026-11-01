import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { defaultColor, defaultSize, type Catalog } from "@/domain/product";
import { fixtureCatalog } from "@/infrastructure/fixture/fixtureCatalog";
import { ProductScreen } from "@/presentation/ProductScreen";
import { theme } from "@/presentation/theme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addedToBag,
  categorySelected,
  colorSelected,
  lightboxClosed,
  lightboxOpened,
  logoPressed,
  searchChanged,
  selectActiveCategory,
  selectCartCount,
  selectFilteredRelated,
  selectLightboxImageUrl,
  selectLightboxOpen,
  selectProductVisible,
  selectSearchQuery,
  selectSelectedColor,
  selectSelectedSize,
  sizeSelected,
} from "@/store/productUiSlice";

export function ProductScreenContainer() {
  const dispatch = useAppDispatch();
  const category = useAppSelector(selectActiveCategory);
  const searchQuery = useAppSelector(selectSearchQuery);
  const selectedSize = useAppSelector(selectSelectedSize);
  const selectedColorId = useAppSelector(selectSelectedColor);
  const count = useAppSelector(selectCartCount);
  const lightboxOpen = useAppSelector(selectLightboxOpen);
  const lightboxImageUrl = useAppSelector(selectLightboxImageUrl);
  const [catalog, setCatalog] = useState<Catalog | null>(null);

  useEffect(() => {
    let active = true;
    fixtureCatalog.getCatalog().then((next) => {
      if (!active) {
        return;
      }
      setCatalog(next);
      const size = defaultSize(next.product.sizes);
      const color = defaultColor(next.product.colors);
      if (size) {
        dispatch(sizeSelected(size));
      }
      if (color) {
        dispatch(colorSelected(color.id));
      }
    });
    return () => {
      active = false;
    };
  }, [dispatch]);

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
      cartCount={count}
      category={category}
      lightboxImageUrl={lightboxImageUrl}
      lightboxOpen={lightboxOpen}
      onAddToBag={() => {
        if (!selectedSize || !selectedColorId) {
          return;
        }
        dispatch(
          addedToBag({
            productId: product.id,
            size: selectedSize,
            colorId: selectedColorId,
          }),
        );
      }}
      onCategoryChange={(next) => dispatch(categorySelected(next))}
      onCloseLightbox={() => dispatch(lightboxClosed())}
      onColorChange={(colorId) => dispatch(colorSelected(colorId))}
      onLogoPress={() => dispatch(logoPressed())}
      onOpenImage={(imageUrl) => dispatch(lightboxOpened(imageUrl))}
      onSearchChange={(value) => dispatch(searchChanged(value))}
      onSizeChange={(size) => dispatch(sizeSelected(size))}
      product={product}
      productVisible={selectProductVisible(category, product.category)}
      relatedProducts={selectFilteredRelated(catalog.relatedProducts, searchQuery)}
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
