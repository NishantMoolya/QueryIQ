export const getFileIcon = (type) => {
    if (type?.includes("pdf")) return "📄";
    if (type?.includes("excel") || type?.includes("sheet")) return "📊";
    if (type?.includes("word") || type?.includes("doc")) return "📝";
    return "📎";
  };