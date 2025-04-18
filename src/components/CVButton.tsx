"use client";

export const CVButton = () => {
  const openMyCV = () => {
    const pdfUrl = "cv/CV2025.pdf";
    window.open(pdfUrl, "_blank");
  };

  return (
    <button
      onClick={openMyCV}
      className="inline-flex items-center gap-2 border border-white bg-white text-gray-900 px-6 h-12 rounded-xl"
    >
      <span>👋</span>
      <span className="font-semibold">My Curriculum Vitae</span>
    </button>
  );
};
