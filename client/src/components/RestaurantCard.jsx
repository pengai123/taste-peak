import React from 'react'
import Rating from '@material-ui/lab/Rating';

export default function RestaurantCard({ restaurant }) {
  const photos = [...restaurant.logo_photos, ...restaurant.food_photos]

  return (
    <div className="restaurant-card">
      <img src={photos.length > 0 ? photos[0] : "https://t4.ftcdn.net/jpg/00/38/13/73/360_F_38137330_gUbR3ZXBc5J5g4pRkaC8TYZQA62OZhx5.jpg"} alt="" />
      <div className="details">
        <h2>{restaurant.name}</h2>
        <div className="user_rating">
          <Rating name="read-only" value={Math.random() * 1.6 + 3.2}
            precision={0.1} size="small" readOnly />
        </div>
        <p className="price-cuisine">
          <span className="cuisine">{restaurant.cuisines.length > 0 ? restaurant.cuisines.slice(0, 4).join(', ') : 'To be explored'}</span>
        </p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      </div>
    </div>
  )
}
