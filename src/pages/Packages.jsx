import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

const packages = [
	{
		title: "Baby Shoots - Basic",
		price: "₹4,999",
		description: "Ideal for newborns & toddlers. Simple indoor setup.",
		inclusions: [
			"1 Hour Session",
			"10 Edited Photos",
			"Props Provided",
			"Online Gallery",
		],
	},
	{
		title: "Baby Shoots - Themed",
		price: "₹7,999",
		description: "Creative themes & custom setups.",
		inclusions: [
			"2 Hour Session",
			"15 Edited Photos",
			"1 Theme Setup",
			"Outfit Coordination",
		],
	},
	{
		title: "Maternity Shoots",
		price: "₹6,999",
		description: "Elegant poses to celebrate motherhood.",
		inclusions: [
			"1.5 Hour Session",
			"15 Edited Photos",
			"Outfit Suggestions",
			"Indoor/Outdoor Option",
		],
	},
	{
		title: "Fashion Shoots",
		price: "₹9,999",
		description: "Perfect for portfolios & model branding.",
		inclusions: [
			"2 Hour Session",
			"20 Edited Photos",
			"Makeup & Styling Support",
			"Studio + Outdoor Shots",
		],
	},
];

// Collect all unique inclusions for table rows
const allInclusions = Array.from(
	Array.from(new Set(packages.flatMap((pkg) => pkg.inclusions)))
);

const Packages = () => {
	const headingRef = useRef();
	const tableRef = useRef();

	useEffect(() => {
		gsap.fromTo(
			headingRef.current,
			{ opacity: 0, y: -30 },
			{ opacity: 1, y: 0, duration: 1, ease: "power2.out" }
		);
		gsap.fromTo(
			tableRef.current,
			{ opacity: 0, y: 40 },
			{ opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power2.out" }
		);
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 py-16 px-2 md:px-8">
			<style>{`
        .pkg-col:hover, .pkg-col:focus-within {
          background: linear-gradient(90deg, #fce7f3 0%, #ede9fe 100%);
          box-shadow: 0 4px 24px 0 rgba(236, 72, 153, 0.08);
          z-index: 1;
        }
        .pkg-col td, .pkg-col th {
          transition: background 0.3s, box-shadow 0.3s;
        }
        .pkg-badge, .pkg-btn {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .pkg-col:hover .pkg-badge, .pkg-col:focus-within .pkg-badge {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 6px 24px 0 rgba(236, 72, 153, 0.12);
        }
        .pkg-col:hover .pkg-btn, .pkg-col:focus-within .pkg-btn {
          transform: scale(1.05) translateY(-1px);
          box-shadow: 0 4px 16px 0 rgba(236, 72, 153, 0.10);
        }
      `}</style>
			<div
				ref={headingRef}
				className="max-w-6xl mx-auto text-center mb-12 mt-16"
			>
				<h1
					className="text-4xl md:text-5xl font-light mb-4 tracking-tight"
					style={{ fontFamily: "'Playfair Display', serif" }}
				>
					Photography Packages
				</h1>
				<p className="text-gray-600 max-w-2xl mx-auto font-light text-lg">
					Compare our packages and choose the perfect fit for your shoot.
				</p>
			</div>
			<div className="overflow-x-auto max-w-6xl mx-auto" ref={tableRef}>
				<table className="min-w-full border-separate border-spacing-y-2">
					<thead>
						<tr>
							<th className="text-left text-sm font-medium text-gray-500 p-3"></th>
							{packages.map((pkg, idx) => (
								<th
									key={idx}
									className="text-center text-base font-semibold text-gray-800 bg-gradient-to-r from-pink-100 to-purple-100 rounded-t-2xl px-6 py-4 pkg-col"
									style={{ fontFamily: "'Playfair Display', serif" }}
									tabIndex={0}
								>
									{pkg.title}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{/* Price Row */}
						<tr>
							<td className="text-sm font-medium text-gray-700 p-3">Price</td>
							{packages.map((pkg, idx) => (
								<td key={idx} className="text-center p-3 pkg-col">
									<span className="inline-block bg-gradient-to-r from-pink-400 to-purple-400 text-white text-base font-semibold rounded-full px-5 py-2 shadow-sm pkg-badge">
										{pkg.price}
									</span>
								</td>
							))}
						</tr>
						{/* Description Row */}
						<tr>
							<td className="text-sm font-medium text-gray-700 p-3">
								Description
							</td>
							{packages.map((pkg, idx) => (
								<td key={idx} className="text-center p-3 text-gray-500 italic text-sm pkg-col">
									{pkg.description}
								</td>
							))}
						</tr>
						{/* Inclusions Rows */}
						{allInclusions.map((inc, i) => (
							<tr key={i}>
								<td className="text-sm text-gray-700 p-3">{inc}</td>
								{packages.map((pkg, idx) => (
									<td key={idx} className="text-center p-3 pkg-col">
										{pkg.inclusions.includes(inc) ? (
											<span className="inline-block w-4 h-4 rounded-full bg-pink-400 mx-auto transition-all duration-200"></span>
										) : (
											<span className="inline-block w-4 h-4 rounded-full bg-gray-200 mx-auto transition-all duration-200"></span>
										)}
									</td>
								))}
							</tr>
						))}
						{/* Book Now Row */}
						<tr>
							<td></td>
							{packages.map((pkg, idx) => (
								<td key={idx} className="text-center p-3 pkg-col">
									<Button className="rounded-full px-7 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium shadow-md transition-transform duration-200 hover:scale-105 pkg-btn">
										Book Now
									</Button>
								</td>
							))}
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Packages;
