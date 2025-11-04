import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, Anchor, Affix, Select, Space } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import "./ProjectDocumentation.css";

const { Link } = Anchor;

// Helper function to convert Vietnamese to English (remove diacritics)
const removeVietnameseDiacritics = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

// Helper function to create anchor ID from text (English only)
const createAnchorId = (text) => {
  if (!text) return '';
  
  // Remove emojis
  let clean = text.replace(/[📚📑]/g, '').trim();
  
  // Remove leading numbers and dots (like "1. ", "1.1. ", etc.)
  clean = clean.replace(/^\d+(\.\d+)*\.\s*/, '');
  
  // Convert Vietnamese to English (remove diacritics)
  clean = removeVietnameseDiacritics(clean);
  
  // Convert to lowercase and replace spaces/special chars
  clean = clean
    .toLowerCase()
    .replace(/[^\w\s-&]/g, '') // Keep alphanumeric, spaces, hyphens, and &
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/&/g, 'and') // Replace & with 'and'
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  
  return clean;
};

// Extract headings for anchor menu
const extractHeadings = (text) => {
  if (!text || text.trim() === '') {
    console.log("extractHeadings: Empty text");
    return [];
  }
  const headings = [];
  const lines = text.split("\n");
  
  console.log("extractHeadings: Processing", lines.length, "lines");
  
  lines.forEach((line, index) => {
    // Match markdown headings (h1-h6) - allow spaces after #
    // Pattern: # followed by one or more spaces, then content
    const trimmedLine = line.trim();
    const match = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      let title = match[2].trim();
      
      console.log(`Found heading at line ${index + 1}: Level ${level}, Title: "${title}"`);
      
      // Skip the "Mục lục" section that's part of the content (early in file)
      if (title.includes('Mục lục') && level === 2 && index < 10) {
        console.log("Skipping 'Mục lục' heading (content section)");
        return;
      }
      
      // Skip if title is empty
      if (!title || title.length === 0) {
        return;
      }
      
      // Create anchor ID
      const anchor = createAnchorId(title);
      
      if (anchor && anchor.length > 0 && title && title.length > 0) {
        headings.push({ 
          level, 
          title, 
          anchor, 
          lineNumber: index 
        });
        console.log(`Added heading: "${title}" -> "${anchor}"`);
      } else {
        console.warn("Skipping heading - invalid anchor or title:", { title, anchor });
      }
    }
  });
  
  console.log("extractHeadings: Final count -", headings.length, "headings");
  if (headings.length > 0) {
    console.log("First 3 headings:", headings.slice(0, 3).map(h => ({ title: h.title, anchor: h.anchor })));
  } else {
    // Debug: check first 30 lines for headings
    console.log("No headings found. Checking first 30 lines:");
    lines.slice(0, 30).forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('#')) {
        console.log(`Line ${idx + 1}: "${trimmed}"`);
      }
    });
  }
  
  return headings;
};

const ProjectDocumentation = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [headings, setHeadings] = useState([]);
  const [lang, setLang] = useState(() => localStorage.getItem("doc_lang") || "vi");

  useEffect(() => {
    setLoading(true);
    const file = lang === "en" ? "/PROJECT_DOCUMENTATION.en.md" : "/PROJECT_DOCUMENTATION.md";
    console.log("Fetching documentation:", file);
    fetch(file)
      .then((res) => {
        console.log("Response status:", res.status, res.statusText);
        if (!res.ok) throw new Error(`File not found: ${res.status} ${res.statusText}`);
        return res.text();
      })
      .then((text) => {
        console.log("File loaded, length:", text.length);
        setContent(text);
        // Extract headings after content is loaded
        const extracted = extractHeadings(text);
        console.log("Setting headings state:", extracted.length);
        setHeadings(extracted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading documentation:", err);
        if (lang === "en") {
          // If EN not found, fallback to VI with banner note
          fetch("/PROJECT_DOCUMENTATION.md")
            .then((r) => r.text())
            .then((vi) => {
              setContent(`# 🇬🇧 English version coming soon\n\n> The English documentation will be available shortly. Displaying Vietnamese version below.\n\n---\n\n${vi}`);
              const extracted = extractHeadings(vi);
              setHeadings(extracted);
              setLoading(false);
            });
        } else {
          const errorContent = `# ❌ Không thể tải tài liệu\n\n**Lỗi:** ${err.message}\n\nVui lòng đảm bảo file \`PROJECT_DOCUMENTATION.md\` được đặt trong thư mục \`client/public/\`.\n\nKiểm tra:\n1. File tồn tại tại: \`client/public/PROJECT_DOCUMENTATION.md\`\n2. Server đang chạy (port 5173)\n3. Refresh lại trang`;
          setContent(errorContent);
          setHeadings([]);
          setLoading(false);
        }
      });
  }, [lang]);


  return (
    <div className="project-documentation">
      <div className="documentation-container">
        {/* Sidebar Menu */}
        <div className="documentation-sidebar">
          <Affix offsetTop={80}>
            <Card
              title={
                <Space style={{ width: "100%", justifyContent: "space-between" }}>
                  <span>
                    <FileTextOutlined /> Mục lục
                  </span>
                  <Select
                    size="small"
                    value={lang}
                    onChange={(v) => {
                      setLang(v);
                      localStorage.setItem("doc_lang", v);
                    }}
                    options={[
                      { label: "Tiếng Việt", value: "vi" },
                      { label: "English", value: "en" },
                    ]}
                    style={{ minWidth: 120 }}
                  />
                </Space>
              }
              className="sidebar-menu"
            >
              {loading ? (
                <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
                  Đang tải mục lục...
                </p>
              ) : !loading && headings && headings.length > 0 ? (
                <Anchor
                  affix={false}
                  targetOffset={80}
                  items={headings
                    .filter(h => h && h.anchor && h.title) // Filter out invalid headings
                    .map((h, idx) => {
                      // Clean title for display (remove emoji and numbers)
                      let displayTitle = h.title
                        .replace(/^[📚📑]\s*/, '')
                        .replace(/^\d+(\.\d+)*\.\s*/, '')
                        .trim();
                      
                      const item = {
                        key: h.anchor || `heading-${h.level}-${idx}`,
                        href: `#${h.anchor}`,
                        title: displayTitle || h.title,
                      };
                      
                      console.log("Anchor item:", item);
                      return item;
                    })}
                />
              ) : (
                <div style={{ color: "#6b7280", fontSize: "14px" }}>
                  <p style={{ margin: 0 }}>Không tìm thấy mục lục</p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>
                    {content.length > 0 ? `Đã load ${content.length} ký tự nhưng không tìm thấy headings` : 'Nội dung chưa được tải'}
                  </p>
                </div>
              )}
            </Card>
          </Affix>
        </div>

        {/* Main Content */}
        <div className="documentation-content">
          <Card className="markdown-content">
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p>Đang tải tài liệu...</p>
              </div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, children, ...props }) => {
                    let text = '';
                    if (typeof children === 'string') {
                      text = children;
                    } else if (Array.isArray(children)) {
                      text = children.map(c => {
                        if (typeof c === 'string') return c;
                        if (c && typeof c === 'object' && 'props' in c) {
                          const childProps = c.props;
                          if (childProps?.children) {
                            return typeof childProps.children === 'string' 
                              ? childProps.children 
                              : '';
                          }
                        }
                        return '';
                      }).join('').trim();
                    }
                    // Use the same createAnchorId function
                    const anchorId = createAnchorId(text);
                    return <h1 id={anchorId || 'heading-1'} {...props}>{children}</h1>;
                  },
                  h2: ({ node, children, ...props }) => {
                    let text = '';
                    if (typeof children === 'string') {
                      text = children;
                    } else if (Array.isArray(children)) {
                      text = children.map(c => {
                        if (typeof c === 'string') return c;
                        if (c && typeof c === 'object' && 'props' in c) {
                          const childProps = c.props;
                          if (childProps?.children) {
                            return typeof childProps.children === 'string' 
                              ? childProps.children 
                              : '';
                          }
                        }
                        return '';
                      }).join('').trim();
                    }
                    // Use the same createAnchorId function
                    const anchorId = createAnchorId(text);
                    return <h2 id={anchorId || 'heading-2'} {...props}>{children}</h2>;
                  },
                  h3: ({ node, children, ...props }) => {
                    let text = '';
                    if (typeof children === 'string') {
                      text = children;
                    } else if (Array.isArray(children)) {
                      text = children.map(c => {
                        if (typeof c === 'string') return c;
                        if (c && typeof c === 'object' && 'props' in c) {
                          const childProps = c.props;
                          if (childProps?.children) {
                            return typeof childProps.children === 'string' 
                              ? childProps.children 
                              : '';
                          }
                        }
                        return '';
                      }).join('').trim();
                    }
                    // Use the same createAnchorId function
                    const anchorId = createAnchorId(text);
                    return <h3 id={anchorId || 'heading-3'} {...props}>{children}</h3>;
                  },
                  h4: ({ node, children, ...props }) => {
                    let text = '';
                    if (typeof children === 'string') {
                      text = children;
                    } else if (Array.isArray(children)) {
                      text = children.map(c => {
                        if (typeof c === 'string') return c;
                        if (c && typeof c === 'object' && 'props' in c) {
                          const childProps = c.props;
                          if (childProps?.children) {
                            return typeof childProps.children === 'string' 
                              ? childProps.children 
                              : '';
                          }
                        }
                        return '';
                      }).join('').trim();
                    }
                    const anchorId = createAnchorId(text);
                    return <h4 id={anchorId || 'heading-4'} {...props}>{children}</h4>;
                  },
                  h5: ({ node, children, ...props }) => {
                    let text = '';
                    if (typeof children === 'string') {
                      text = children;
                    } else if (Array.isArray(children)) {
                      text = children.map(c => {
                        if (typeof c === 'string') return c;
                        if (c && typeof c === 'object' && 'props' in c) {
                          const childProps = c.props;
                          if (childProps?.children) {
                            return typeof childProps.children === 'string' 
                              ? childProps.children 
                              : '';
                          }
                        }
                        return '';
                      }).join('').trim();
                    }
                    const anchorId = createAnchorId(text);
                    return <h5 id={anchorId || 'heading-5'} {...props}>{children}</h5>;
                  },
                  h6: ({ node, children, ...props }) => {
                    let text = '';
                    if (typeof children === 'string') {
                      text = children;
                    } else if (Array.isArray(children)) {
                      text = children.map(c => {
                        if (typeof c === 'string') return c;
                        if (c && typeof c === 'object' && 'props' in c) {
                          const childProps = c.props;
                          if (childProps?.children) {
                            return typeof childProps.children === 'string' 
                              ? childProps.children 
                              : '';
                          }
                        }
                        return '';
                      }).join('').trim();
                    }
                    const anchorId = createAnchorId(text);
                    return <h6 id={anchorId || 'heading-6'} {...props}>{children}</h6>;
                  },
                  table: ({ node, ...props }) => (
                    <div style={{ overflowX: "auto", margin: "24px 0" }}>
                      <table {...props} />
                    </div>
                  ),
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline ? (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDocumentation;


