# Apollo Search: AI-Powered Academic Research Assistant

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/akashi-projects/v0-academic-research-assistant)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Powered by Perplexity](https://img.shields.io/badge/Powered%20by-Perplexity%20AI-5032FF?style=for-the-badge)](https://perplexity.ai/)

*English | [Tiếng Việt](#tiếng-việt)*

## Overview

Apollo Search is a next-generation academic research platform that reimagines how researchers access scholarly knowledge. Built as an evolution of platforms like Sci-Hub, Apollo Search integrates the power of Perplexity AI to not just find papers, but to understand, synthesize, and contextualize academic literature.

## Key Features

- **AI-Powered Search**: Leverage Perplexity's advanced AI to find the most relevant academic papers from top scholarly sources
- **Academic Focus**: Specialized search prioritizing academic databases like Google Scholar, PubMed, arXiv, and Semantic Scholar
- **Advanced Search Options**: Filter by author, publication year, journal, DOI, and more
- **Research Synthesis**: Get AI-generated summaries of multiple research papers on your topic
- **Save & Organize**: Bookmark papers to build your research library locally in your browser
- **Citation Helper**: Easily copy formatted citations for your research
- **Multilingual Support**: Planned support for multiple languages to make research accessible to scholars worldwide

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **AI Integration**: Perplexity API
- **Design System**: Shadcn UI components

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Perplexity API key (get one at [perplexity.ai](https://perplexity.ai))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/apollo-search.git
cd apollo-search

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Perplexity API key to .env.local

# Start the development server
npm run dev
```

Visit `http://localhost:3000` to see the application running.

## Configuration

Create a `.env.local` file with the following variables:

```
PPLX_API_KEY=your_perplexity_api_key_here
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

<a name="tiếng-việt"></a>
# Apollo Search: Trợ Lý Nghiên Cứu Học Thuật Được Hỗ Trợ bởi AI

## Tổng Quan

Apollo Search là nền tảng nghiên cứu học thuật thế hệ mới, tái định nghĩa cách các nhà nghiên cứu tiếp cận kiến thức học thuật. Được xây dựng như một phiên bản nâng cấp của các nền tảng như Sci-Hub, Apollo Search tích hợp sức mạnh của Perplexity AI không chỉ để tìm kiếm các bài báo, mà còn để hiểu, tổng hợp và đặt tài liệu học thuật vào ngữ cảnh.

## Tính Năng Chính

- **Tìm Kiếm Được Hỗ Trợ bởi AI**: Tận dụng AI tiên tiến của Perplexity để tìm các bài báo học thuật liên quan nhất từ các nguồn học thuật hàng đầu
- **Tập Trung Học Thuật**: Tìm kiếm chuyên biệt ưu tiên các cơ sở dữ liệu học thuật như Google Scholar, PubMed, arXiv và Semantic Scholar
- **Tùy Chọn Tìm Kiếm Nâng Cao**: Lọc theo tác giả, năm xuất bản, tạp chí, DOI và nhiều tiêu chí khác
- **Tổng Hợp Nghiên Cứu**: Nhận tóm tắt được tạo bởi AI từ nhiều bài báo nghiên cứu về chủ đề của bạn
- **Lưu & Tổ Chức**: Đánh dấu các bài báo để xây dựng thư viện nghiên cứu của bạn ngay trong trình duyệt
- **Trợ Giúp Trích Dẫn**: Dễ dàng sao chép trích dẫn đã được định dạng cho nghiên cứu của bạn
- **Hỗ Trợ Đa Ngôn Ngữ**: Dự kiến hỗ trợ nhiều ngôn ngữ khác nhau để làm cho nghiên cứu tiếp cận được với học giả trên toàn thế giới

## Công Nghệ Sử Dụng

- **Frontend**: Next.js, React, Tailwind CSS
- **Tích Hợp AI**: Perplexity API
- **Hệ Thống Thiết Kế**: Các component Shadcn UI

## Bắt Đầu

### Yêu Cầu Trước Khi Cài Đặt

- Node.js 18+ và npm
- Khóa API Perplexity (lấy tại [perplexity.ai](https://perplexity.ai))

### Cài Đặt

```bash
# Clone repository
git clone https://github.com/yourusername/apollo-search.git
cd apollo-search

# Cài đặt các gói phụ thuộc
npm install

# Thiết lập biến môi trường
cp .env.example .env.local
# Thêm khóa API Perplexity vào .env.local

# Khởi động máy chủ phát triển
npm run dev
```

Truy cập `http://localhost:3000` để xem ứng dụng đang chạy.

## Cấu Hình

Tạo file `.env.local` với các biến sau:

```
PPLX_API_KEY=api_perplexity
```

## Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng gửi Pull Request nếu bạn muốn cải thiện dự án.
