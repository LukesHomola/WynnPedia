import React, { useContext, useEffect, useState } from "react";

// Utility function to sanitize HTML
const sanitizeHTML = (html) => {
  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

const NewsComponent = () => {
  const [fetchedNews, setFetchedNews] = useState([]);

  const fetchNews = async () => {
    try {
      const response = await fetch("https://api.wynncraft.com/v3/latest-news");
      if (!response) {
        console.log("No response from API");
      }
      const data = await response.json();
      setFetchedNews(data);
    } catch (error) {
      console.error(error);
      console.log("Error fetching Wynn news. ", error);
    }
  };

  useEffect(() => {
    fetchNews();
  });

  return (
    <div className="news_wrapper">
      <div className="news_container">
        {" "}
        <section className="pL-1">
          {" "}
          <h1>Wynncraft News</h1>
          <p>Latest information from world of Wynncraft.</p>
        </section>
        {fetchedNews.map((news, index) => {
          return (
            <div key={index} className="news_item">
              <section className="flex gap-05">
                <h6 className="news_date">{news.date}</h6>
                <h4>{news.title}</h4>
              </section>
              <br></br>
              <h6>By: {news.author}</h6>
              <br></br>
              <p>{sanitizeHTML(news.content)}</p>
              <br></br>
              <button
                href={news.forumThread}
                target="_blank"
                className="news_btn"
              >
                See full post
              </button>
              <br></br>
              <br></br>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsComponent;
