module.exports = {
	month: (number) => {
		const months = [
			{
				abbreviation: "Jan",
				name: "January",
				value: 0,
			},
			{
				abbreviation: "Feb",
				name: "February",
				value: 1,
			},
			{
				abbreviation: "Mar",
				name: "March",
				value: 2,
			},
			{
				abbreviation: "Apr",
				name: "April",
				value: 3,
			},
			{
				abbreviation: "May",
				name: "May",
				value: 4,
			},
			{
				abbreviation: "Jun",
				name: "June",
				value: 5,
			},
			{
				abbreviation: "Jul",
				name: "July",
				value: 6,
			},
			{
				abbreviation: "Aug",
				name: "August",
				value: 7,
			},
			{
				abbreviation: "Sep",
				name: "September",
				value: 8,
			},
			{
				abbreviation: "Oct",
				name: "October",
				value: 9,
			},
			{
				abbreviation: "Nov",
				name: "November",
				value: 10,
			},
			{
				abbreviation: "Dec",
				name: "December",
				value: 11,
			},
		];
		return number ? months[number - 1] : months;
	},
	days: (number) => {
		const days = [
			{ name: "Sunday", value: 0 },
			{ name: "Monday", value: 1 },
			{ name: "Tuesday", value: 2 },
			{ name: "Wednesday", value: 3 },
			{ name: "Thursday", value: 4 },
			{ name: "Friday", value: 5 },
			{ name: "Saturday", value: 6 },
		];
		return number ? days[number - 1] : days;
	},
};
