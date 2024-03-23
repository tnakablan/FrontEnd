import React, { useEffect, useState } from "react";
import axios from "axios";
import { api_endpoints as API_ENDPOINT, formUrl as URL } from "../../api/api";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import SkeletonLoader from "../Loader/SkeletonLoader";
import useCarouselNavigate from "../Hooks/useCarouselNavigation";
import { Link } from "react-router-dom";
import "../../css/bestseller.css";
import Currency from "../Item Screen/Currency";

function BestSellers() {
  const [api, setApi] = useState({
    loading: true,
    data: [],
    error: false,
  });

  const { scrollRef, itemRef, btnActive, handleScrollLeft, handleScrollRight } =
    useCarouselNavigate(api.data);

  useEffect(() => {
    setApi({ data: [], loading: true, error: false });
    axios
      .get(`${URL(API_ENDPOINT.productApi)}/view/bestsellers`)
      .then(({ data }) => {
        setApi({ data, loading: false });
      })
      .catch(() => {
        setApi({ data: [], loading: false, error: true });
      });
  }, []);

  const { data, error, loading } = api;
  return (
    <div className="bestseller-main-container">
      <div className="bestseller-main-header">
        <h2>Best sellers in Mobiles, Laptops & Accessories</h2>
        {!loading && !error && data.length > 0 && (
          <div className="home-corousel-btns">
            <button onClick={handleScrollLeft} disabled={btnActive.left}>
              <BiChevronLeft />
            </button>
            <button onClick={handleScrollRight} disabled={btnActive.right}>
              <BiChevronRight />
            </button>
          </div>
        )}
      </div>

      <div className="bestseller-main-sub-container">
        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <span className="bestseller-error">Couldn't load the products.</span>
        ) : (
          <div className="bestseller-container" ref={scrollRef}>
            {data.map((item) => {
              const { id, title, thumbnail, price,stock=100 } = item;
              const imgUrl = `data:${thumbnail.type};base64,${thumbnail.picByte}`;
              return (
                <Link
                  to={`/products/${id}`}
                  ref={itemRef}
                  key={id}
                  className="best-seller-item-container"
                >
                  <img src={imgUrl} alt="bestsellers" />
                  <span className="todaysdeal-stock todaysdeals-details">
                    {stock > 0 ? "In Stock" : "Out of Stock"}-
                    {stock > 0 ? (
                      <span className="todaysdeal-stock-quantity">{stock}</span>
                    ) : null}
                  </span>
                  <div className="bestseller-details">
                    <h4>{title}</h4>
                    <div className="bestseller-currency">
                      <Currency curr={price} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default BestSellers;
