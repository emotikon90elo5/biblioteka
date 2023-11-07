let monthRents = document.getElementById('monthRents')
let monthPercent = document.getElementById('monthPercent')
let monthIco = document.getElementById('monthIco')
const getDays = (numberOfDays) => {
  let data = new Date()
  let days = []
  days.push(data.getDate() + "/" + (data.getMonth() + 1))
  for (let i = 0; i < numberOfDays - 1; i++) {
    data.setDate(data.getDate() - 1)
    days.push(data.getDate() + "/" + (data.getMonth() + 1))
  }
  return days
}

const renderChart = async () => {
  let days = getDays(14).reverse()
  const response = await fetch(`/api/homepage/lastdays`, {
  });
  let data = []
  let i = 0;
  let jsona = await response.json();
  let addvalue
  let lastMonth = jsona.lastmon[0].count
  let thisMonth = jsona.thismon[0].count
  let percent
  if(lastMonth==0){
     percent = 0
  }else{
   percent = (thisMonth / lastMonth *100)-100 
  }
  monthRents.innerText = thisMonth
  monthPercent.innerText = Math.round(percent) + "%"

  if (percent < 0) {
    monthIco.classList.add('ti-arrow-down-right')
    monthIco.classList.add('text-danger')
  } else {
    monthIco.classList.add('ti-arrow-up-left')
    monthIco.classList.add('text-success')
  }
  console.log(percent);
  await days.forEach((day) => {
    if (jsona.data[i]) {
      addvalue = jsona.data[i].day
    } else {
      addvalue = '00'
    }
    if (day.startsWith(addvalue + "/")) {
      data.push(jsona.data[i].count)
      i++
    } else {

      data.push(0)
    }
  })
  var chart = {
    series: [
      { name: "Wyporzyczenia:", data: data },
    ],

    chart: {
      type: "bar",
      height: 345,
      offsetX: -15,
      toolbar: { show: true },
      foreColor: "#adb0bb",
      fontFamily: 'inherit',
      sparkline: { enabled: false },
    },

    colors: ["#5D87FF"],


    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "35%",
        borderRadius: [6],
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all'
      },
    },
    markers: { size: 0 },

    dataLabels: {
      enabled: false,
    },


    legend: {
      show: false,
    },


    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },

    xaxis: {
      type: "category",
      categories: getDays(14).reverse(),
      labels: {
        style: { cssClass: "grey--text lighten-2--text fill-color" },
      },
    },


    yaxis: {
      show: true,
      min: 0,
      max: 50,
      tickAmount: 4,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    stroke: {
      show: true,
      width: 3,
      lineCap: "butt",
      colors: ["transparent"],
    },


    tooltip: { theme: "light" },

    responsive: [
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 3,
            }
          },
        }
      }
    ]


  };

  var chart = new ApexCharts(document.querySelector("#chart"), chart);
  chart.render();
}

// $(function () {
//   // =====================================
//   // Profit
//   // =====================================



//   // =====================================
//   // Breakup
//   // =====================================
//   var breakup = {
//     color: "#adb5bd",
//     series: [10000],
//     labels: ["2023"],
//     chart: {
//       width: 180,
//       type: "donut",
//       fontFamily: "Plus Jakarta Sans', sans-serif",
//       foreColor: "#adb0bb",
//     },
//     plotOptions: {
//       pie: {
//         startAngle: 0,
//         endAngle: 360,
//         donut: {
//           size: '75%',
//         },
//       },
//     },
//     stroke: {
//       show: false,
//     },

//     dataLabels: {
//       enabled: false,
//     },

//     legend: {
//       show: false,
//     },
//     colors: ["#5D87FF", "#ecf2ff", "#F9F9FD"],

//     responsive: [
//       {
//         breakpoint: 991,
//         options: {
//           chart: {
//             width: 150,
//           },
//         },
//       },
//     ],
//     tooltip: {
//       theme: "dark",
//       fillSeriesColor: false,
//     },
//   };

//   var chart = new ApexCharts(document.querySelector("#breakup"), breakup);
//   chart.render();



// =====================================
// Earning
// =====================================
// var earning = {
//   chart: {
//     id: "sparkline3",
//     type: "area",
//     height: 60,
//     sparkline: {
//       enabled: true,
//     },
//     group: "sparklines",
//     fontFamily: "Plus Jakarta Sans', sans-serif",
//     foreColor: "#adb0bb",
//   },
//   series: [
//     {
//       name: "Earnings",
//       color: "#49BEFF",
//       data: [25, 66, 20, 40, 12, 58, 20],
//     },
//   ],
//   stroke: {
//     curve: "smooth",
//     width: 2,
//   },
//   fill: {
//     colors: ["#f3feff"],
//     type: "solid",
//     opacity: 0.05,
//   },

//   markers: {
//     size: 0,
//   },
//   tooltip: {
//     theme: "dark",
//     fixed: {
//       enabled: true,
//       position: "right",
//     },
//     x: {
//       show: false,
//     },
//   },
// };
// new ApexCharts(document.querySelector("#earning"), earning).render();
// })
renderChart()