<template>


    <!--  D3 -->
    <div class="index_child">
        <svg id="tw_box" viewBox="0 0 370 500">
            <g class="counties"></g>
            <path class="county-borders"></path>
        </svg>
    </div>
    <!--  D3 -->


</template>

<script>
    export default {
        data() {
            return {
                taiwan_weather: null,
                list_now: {
                    WD_code: "14",
                },
                list_full: [],
                citys_list: [],
                citys_list_child: {
                    0: false,
                    1: false,
                    2: false,
                    3: false,
                    4: false,
                },
                show_list: false,
                //特效
                ani_show: false,
                block_show: false
            };
        },
        inject: ["api_url", "remove_loading"],

        methods: {





        },
        mounted() {

            const d3 = Object.assign({}, require("d3-geo"), require("d3-selection"), )

            //D3繪製地圖
            const projection = d3
                .geoMercator()
                .center([122.95, 23.7])
                .scale(7300);

            const map = require("../json/taiwan_map_mod.json");



            var path = d3.geoPath().projection(projection);

            const svg = d3
                .select("#tw_box")
                .select("g")
                .selectAll("path")
                .data(map.features)
                .enter();

            //地圖
            svg
                .append("path")
                .attr("d", path)
                .attr("id", (i) => {
                    return "block_" + i.properties["COUNTYCODE"];
                })
                .attr("name", (i) => {
                    return i.properties["COUNTYNAME"];
                })
                .on("mouseover", (i) => {

                    d3.selectAll("#" + i.target.id).classed("active", true)

                })
                .on("mouseleave", (i) => {

                    d3.selectAll("#" + i.target.id).classed("active", false)
                })
                .on("click", (i) => {

                    this.$emit('map_click', d3.selectAll('#' + i.currentTarget.id).attr('name'))

                });

            //標籤
            svg
                .append("text")
                .attr("x", (i) => {
                    if (i.properties["X"] != null)
                        return path.centroid(i)[0] + i.properties["X"];
                    else return path.centroid(i)[0] - 25;
                })
                .attr("y", (i) => {
                    if (i.properties["Y"] != null)
                        return path.centroid(i)[1] + i.properties["Y"];
                    else return path.centroid(i)[1] + 8;
                })
                .attr("id", (i) => {
                    return "block_" + i.properties["COUNTYCODE"];
                })
                .text((i) => {
                    return i.properties["COUNTYNAME"];
                })
                .on("mouseover", (i) => {

                    d3.selectAll("#" + i.target.id).classed("active", true)



                })
                .on("mouseleave", (i) => {

                    d3.selectAll("#" + i.target.id).classed("active", false)
                })
                .on("click", (i) => {

                    this.$emit('map_click', i.target.innerHTML)

                    console.log(this.select_city)



                });



            document.querySelector('#block_63000').classList.add('d3_select')




        },

        props: {
            select_city: String,
        },
        created() {






        },


        watch: {
            'select_city': function name(newVal) {

                //  alert('watch new value = ' + this.select_city);

                const all_path = document.querySelectorAll('path')

                all_path.forEach(e => {
                    e.classList.remove('d3_select')
                });




                const select_id = document.querySelector(`[name="${this.select_city}"] `).id



                document.querySelector('#' + select_id).classList.add('d3_select')




            }
        }





    };
</script>