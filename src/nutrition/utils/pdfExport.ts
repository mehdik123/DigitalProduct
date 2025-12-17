import jsPDF from "jspdf";
import { MealPlan } from "@nutrition/types/meal";
import { toast } from "sonner";

// Helper to load image as base64
const loadImage = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      try {
        const dataURL = canvas.toDataURL("image/jpeg", 0.8);
        resolve(dataURL);
      } catch (e) {
        console.warn("Could not convert image to data URL, likely tainted canvas", e);
        resolve(""); // Resolve empty to continue without image
      }
    };
    img.onerror = (e) => {
      console.warn("Failed to load image", url, e);
      resolve(""); // Resolve empty
    };
    img.src = url;
  });
};

export const exportMealPlanToPDF = async (mealPlan: MealPlan) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // Colors (Dark Theme)
  const colors = {
    background: [17, 24, 39], // #111827
    surface: [31, 41, 55],    // #1F2937
    primary: [59, 130, 246],  // #3B82F6 (Blue-500)
    text: [243, 244, 246],    // #F3F4F6
    textMuted: [156, 163, 175], // #9CA3AF
    accent: [16, 185, 129],   // #10B981 (Green - for Fiber)
    border: [55, 65, 81],     // #374151
  };

  // Set Background
  doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
      doc.rect(0, 0, pageWidth, pageHeight, "F"); // Re-apply background
      yPosition = margin;
      return true;
    }
    return false;
  };

  // --- Header ---
  doc.setFillColor(colors.surface[0], colors.surface[1], colors.surface[2]);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("HYBRID ATHLETE", margin, 20);

  doc.setTextColor(255, 255, 255);
  doc.text("BLUEPRINT", margin + 65, 20); // Quick offset

  doc.setFontSize(10);
  doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
  doc.setFont("helvetica", "normal");
  doc.text("NUTRITION PLAN", margin, 27);
  doc.text(new Date().toLocaleDateString(), pageWidth - margin, 20, { align: "right" });

  yPosition = 55;

  // --- Plan Title & Description ---
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(`${mealPlan.calorieTarget}`, margin, yPosition);

  const kcalWidth = doc.getTextWidth(`${mealPlan.calorieTarget}`);
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.setFontSize(18);
  doc.text(" KCAL PLAN", margin + kcalWidth + 2, yPosition);

  yPosition += 10;
  doc.setFontSize(11);
  doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
  doc.text(mealPlan.description, margin, yPosition);

  yPosition += 15;

  // --- Daily Totals Box ---
  const totalMacros = mealPlan.meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats,
      fiber: acc.fiber + (meal.fiber || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 }
  );

  doc.setFillColor(colors.surface[0], colors.surface[1], colors.surface[2]);
  doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 25, 3, 3, "FD");

  // Macro Totals Grid
  const startX = margin + 10;
  const boxCenterY = yPosition + 14;
  const colGap = 35;

  // Calories
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`${totalMacros.calories}`, startX, boxCenterY - 2);
  doc.setFontSize(8);
  doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
  doc.text("CALORIES", startX, boxCenterY + 5);

  // Protein
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.setFontSize(14);
  doc.text(`${totalMacros.protein}g`, startX + colGap, boxCenterY - 2);
  doc.setFontSize(8);
  doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
  doc.text("PROTEIN", startX + colGap, boxCenterY + 5);

  // Carbs
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.setFontSize(14);
  doc.text(`${totalMacros.carbs}g`, startX + colGap * 2, boxCenterY - 2);
  doc.setFontSize(8);
  doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
  doc.text("CARBS", startX + colGap * 2, boxCenterY + 5);

  // Fats
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.setFontSize(14);
  doc.text(`${totalMacros.fats}g`, startX + colGap * 3, boxCenterY - 2);
  doc.setFontSize(8);
  doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
  doc.text("FATS", startX + colGap * 3, boxCenterY + 5);

  // Fiber (Highlighted)
  doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.setFontSize(14);
  doc.text(`${totalMacros.fiber}g`, startX + colGap * 4, boxCenterY - 2);
  doc.setFontSize(8);
  doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
  doc.text("FIBER", startX + colGap * 4, boxCenterY + 5);

  yPosition += 40;

  // --- Meals ---
  // Pre-load images
  const mealImages = await Promise.all(
    mealPlan.meals.map(meal => loadImage(meal.image))
  );

  for (let index = 0; index < mealPlan.meals.length; index++) {
    const meal = mealPlan.meals[index];
    const imgData = mealImages[index];

    // Increased space for card including image
    checkNewPage(120);

    // Draw Image if available
    if (imgData) {
      try {
        const imgWidth = 60;
        const imgHeight = 40;
        const imgX = pageWidth - margin - imgWidth; // Align right
        // Round corners hack: Clip? jsPDF clipping is complex. Just rect for now.
        // Or just draw image.
        doc.addImage(imgData, 'JPEG', imgX, yPosition, imgWidth, imgHeight);
      } catch (e) {
        console.error("Error adding image to PDF", e);
      }
    }

    // Meal Type Badge
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.roundedRect(margin, yPosition, 4, 18, 1, 1, "F");

    // Meal Type Text
    doc.setFontSize(9);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFont("helvetica", "bold");
    doc.text(meal.type.toUpperCase(), margin + 8, yPosition + 4);

    // Meal Name (Wrapped if needed, to avoid overlapping image)
    doc.setFontSize(16);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);

    // Wrap text to avoid image (pageWidth - margin*2 - imageWidth - gap)
    const textWidth = pageWidth - margin * 2 - 70;
    const splitTitle = doc.splitTextToSize(meal.name, textWidth);
    doc.text(splitTitle, margin + 8, yPosition + 12);

    // Move Y down based on title height, but minimum to clear the badge area
    const titleHeight = splitTitle.length * 7;
    let contentY = yPosition + 12 + titleHeight;

    // Macros Line
    // Ensure we are below the image or wrapping around?
    // Let's just put macros below title.
    doc.setFontSize(10);
    doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
    doc.setFont("helvetica", "normal");
    const macroText = `${meal.calories} kcal  |  ${meal.protein}g P  |  ${meal.carbs}g C  |  ${meal.fats}g F  |  `;
    doc.text(macroText, margin + 8, contentY);

    const w = doc.getTextWidth(macroText);
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.text(`${meal.fiber || 0}g Fiber`, margin + 8 + w, contentY);

    contentY += 8;

    // Prep Time
    if (meal.prepTime) {
      doc.setFontSize(9);
      doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
      doc.text(`Duration: ${meal.prepTime}`, margin + 8, contentY);
      contentY += 8;
    }

    // Ensure we clear the image height before starting ingredients (approx 45 units from start)
    const imageClearance = yPosition + 45;
    yPosition = Math.max(contentY + 5, imageClearance);


    // Ingredients
    checkNewPage(20);
    doc.setFontSize(11);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Ingredients", margin + 8, yPosition + 6);
    yPosition += 12;

    meal.ingredients.forEach((ing) => {
      checkNewPage(7);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);

      // Dot
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.circle(margin + 10, yPosition - 1, 1, "F");

      doc.text(ing.name, margin + 15, yPosition);

      // Amount
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.text(ing.amount, pageWidth - margin - 20, yPosition, { align: "right" });

      yPosition += 7;
    });

    yPosition += 6;

    // Instructions
    checkNewPage(20);
    doc.setFontSize(11);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Instructions", margin + 8, yPosition + 6);
    yPosition += 12;

    meal.instructions.forEach((inst, i) => {
      checkNewPage(12);

      // Step number
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`${i + 1}`, margin + 10, yPosition);

      // Text
      doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
      doc.setFont("helvetica", "normal");

      const lines = doc.splitTextToSize(inst, pageWidth - margin * 2 - 25);
      lines.forEach((line: string) => {
        checkNewPage(6);
        doc.text(line, margin + 18, yPosition);
        yPosition += 6;
      });
      yPosition += 2;
    });

    yPosition += 20; // Space between meals
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
    doc.text(
      `Hybrid Athlete Blueprint - ${mealPlan.calorieTarget} kcal Plan - Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  // Save
  doc.save(`Hybrid_Athlete_${mealPlan.calorieTarget}kcal_MealPlan.pdf`);
};
