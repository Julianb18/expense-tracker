import React from "react";
import { CategoryCard } from "./CategoryCard";

export const MonthCategoryList = ({
  categories,
  isEditMode,
  draggedIndex,
  dropTargetIndex,
  isDragging,
  touchCurrentY,
  touchStartY,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onAddExpense,
  onViewExpense,
  onCategoryDelete,
  uid,
  year,
  month,
}) => {
  const lastIndex = categories.length - 1;

  return (
    <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center md:gap-6 items-center py-4 md:py-0">
      {isDragging && dropTargetIndex === 0 && (
        <div className="w-full xs:max-w-[400px] h-2 bg-blue-400 rounded-full mb-2 opacity-60" />
      )}
      {categories.map((category, index) => (
        <div
          key={category.title}
          data-category-index={index}
          draggable={isEditMode}
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={(e) => onDragOver(e, index)}
          onDrop={(e) => onDrop(e, index)}
          onDragEnd={onDragEnd}
          onTouchStart={(e) => onTouchStart(e, index)}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className={`w-full xs:max-w-[400px] transition-all duration-150 ${
            isEditMode ? "cursor-move" : ""
          } ${draggedIndex === index ? "opacity-50" : ""} ${
            dropTargetIndex === index
              ? "ring-2 ring-blue-400 ring-opacity-60 bg-blue-50"
              : ""
          }`}
          style={{
            transform:
              isDragging && draggedIndex === index && touchCurrentY !== null
                ? `translateY(${touchCurrentY - touchStartY}px)`
                : "translateY(0px)",
            zIndex: isDragging && draggedIndex === index ? 1000 : "auto",
            touchAction: isEditMode ? "none" : "auto",
          }}
        >
          <CategoryCard
            category={category}
            handleAddExpense={onAddExpense}
            handleViewExpense={onViewExpense}
            handleCategoryDelete={onCategoryDelete}
            uid={uid}
            year={year}
            month={month}
            isEditMode={isEditMode}
            isDragging={isDragging && draggedIndex === index}
          />
        </div>
      ))}
      {isDragging && dropTargetIndex === lastIndex && (
        <div className="w-full xs:max-w-[400px] h-2 bg-blue-400 rounded-full mt-2 opacity-60" />
      )}
    </div>
  );
};
