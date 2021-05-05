import React from 'react'
import Rating from '@material-ui/lab/Rating';

export default function RestaurantCard({ restaurant }) {

	const priceRange = function (range, currency) {
		let result = "";
		for (let i = 0; i < range; i++) {
			result += currency;
		}
		return result;
	}

	return (
		<div className="restaurant-card">
			<a className="image" href={restaurant.restaurant.url} target="_blank">
				<img src={restaurant.restaurant.featured_image ? restaurant.restaurant.featured_image : "https://t4.ftcdn.net/jpg/00/38/13/73/360_F_38137330_gUbR3ZXBc5J5g4pRkaC8TYZQA62OZhx5.jpg"} alt="" />
			</a>
			<div className="details">
				<h2>{restaurant.restaurant.name}</h2>
				<div className="user_rating">
					<Rating name="read-only" value={Number(restaurant.restaurant.user_rating.aggregate_rating)}
						precision={0.1} size="small" readOnly />
					<span className="rating_text" style={{ color: "#" + restaurant.restaurant.user_rating.rating_color }}>{restaurant.restaurant.user_rating.rating_text}</span>
				</div>
				<p className="price-cuisine">
					<span className="price-range">{priceRange(restaurant.restaurant.price_range, restaurant.restaurant.currency)}</span>
					<span className="cuisine">{restaurant.restaurant.cuisines}</span>
				</p>
				<p>Lorem ipsum dolor sit amet.</p>
			</div>
		</div>
	)
}
