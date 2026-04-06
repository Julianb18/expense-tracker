import { useCallback, useEffect, useRef, useState } from "react";

const SCROLL_THRESHOLD_PX = 100;
const SAFE_ZONE_WIDTH = 64;

function reorderCategories(list, fromIndex, toIndex) {
  if (
    fromIndex === toIndex ||
    fromIndex == null ||
    toIndex == null ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= list.length ||
    toIndex >= list.length
  ) {
    return null;
  }
  const next = [...list];
  const [removed] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, removed);
  return next;
}

function resolveTouchDropTarget(y, touchStartIndex, categoryCount) {
  if (categoryCount === 0) return null;

  const categoryElements = document.querySelectorAll("[data-category-index]");
  let newDropTarget = null;

  for (let i = 0; i < categoryElements.length; i++) {
    if (i === touchStartIndex) continue;

    const rect = categoryElements[i].getBoundingClientRect();
    const elementCenter = rect.top + rect.height / 2;

    if (y < elementCenter) {
      newDropTarget = i;
      break;
    }
  }

  if (newDropTarget === null && categoryElements.length > 0) {
    const lastRect =
      categoryElements[categoryElements.length - 1].getBoundingClientRect();
    if (y > lastRect.bottom) {
      newDropTarget = categoryElements.length - 1;
    }
  }

  if (newDropTarget === null && categoryElements.length > 0) {
    const firstRect = categoryElements[0].getBoundingClientRect();
    if (y < firstRect.top) {
      newDropTarget = 0;
    }
  }

  return newDropTarget;
}

/**
 * Desktop HTML5 drag-and-drop + mobile touch reorder for a category list.
 */
export function useCategoryReorder({
  categories = [],
  isEditMode,
  onPersistOrder,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchStartIndex, setTouchStartIndex] = useState(null);
  const [touchCurrentY, setTouchCurrentY] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);

  const autoScrollRef = useRef(null);
  const touchStartYRef = useRef(null);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current != null) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  }, []);

  const startAutoScroll = useCallback(
    (direction) => {
      if (autoScrollRef.current != null) return;
      const scrollAmount = direction === "up" ? -10 : 10;
      autoScrollRef.current = setInterval(() => {
        window.scrollBy(0, scrollAmount);
      }, 16);
    },
    [],
  );

  useEffect(() => {
    return () => stopAutoScroll();
  }, [stopAutoScroll]);

  useEffect(() => {
    if (!isEditMode) {
      stopAutoScroll();
    }
  }, [isEditMode, stopAutoScroll]);

  const commitReorder = useCallback(
    (fromIndex, toIndex) => {
      const next = reorderCategories(categories, fromIndex, toIndex);
      if (next) onPersistOrder(next);
    },
    [categories, onPersistOrder],
  );

  const handleDragStart = useCallback((e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e, dropIndex) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTargetIndex(dropIndex);
  }, []);

  const handleDrop = useCallback(
    (e, dropIndex) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === dropIndex) {
        setDraggedIndex(null);
        setDropTargetIndex(null);
        return;
      }
      commitReorder(draggedIndex, dropIndex);
      setDraggedIndex(null);
      setDropTargetIndex(null);
    },
    [draggedIndex, commitReorder],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
  }, []);

  const handleTouchStart = useCallback(
    (e, index) => {
      if (!isEditMode) return;

      const touchX = e.touches[0].clientX;
      if (touchX > window.innerWidth - SAFE_ZONE_WIDTH) return;

      e.preventDefault();
      const y = e.touches[0].clientY;
      touchStartYRef.current = y;
      setTouchStartY(y);
      setTouchCurrentY(y);
      setTouchStartIndex(index);
      setDraggedIndex(index);
      setIsDragging(true);
    },
    [isEditMode],
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isEditMode || touchStartIndex === null) return;
      e.preventDefault();

      const currentY = e.touches[0].clientY;
      setTouchCurrentY(currentY);

      const newDropTarget = resolveTouchDropTarget(
        currentY,
        touchStartIndex,
        categories.length,
      );
      setDropTargetIndex(newDropTarget);

      const originY = touchStartYRef.current;
      if (originY == null) return;

      const deltaY = currentY - originY;
      if (Math.abs(deltaY) > SCROLL_THRESHOLD_PX) {
        startAutoScroll(deltaY > 0 ? "down" : "up");
      } else {
        stopAutoScroll();
      }
    },
    [isEditMode, touchStartIndex, categories.length, startAutoScroll, stopAutoScroll],
  );

  const handleTouchEnd = useCallback(
    (e) => {
      if (!isEditMode || touchStartIndex === null) return;
      e.preventDefault();

      stopAutoScroll();

      if (
        dropTargetIndex !== null &&
        dropTargetIndex !== touchStartIndex &&
        dropTargetIndex >= 0 &&
        dropTargetIndex < categories.length
      ) {
        commitReorder(touchStartIndex, dropTargetIndex);
      }

      touchStartYRef.current = null;
      setTouchStartY(null);
      setTouchCurrentY(null);
      setTouchStartIndex(null);
      setDraggedIndex(null);
      setIsDragging(false);
      setDropTargetIndex(null);
    },
    [
      isEditMode,
      touchStartIndex,
      dropTargetIndex,
      categories.length,
      commitReorder,
      stopAutoScroll,
    ],
  );

  return {
    draggedIndex,
    dropTargetIndex,
    isDragging,
    touchCurrentY,
    touchStartY,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
