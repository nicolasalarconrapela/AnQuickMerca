import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';

const CCAA_DISPLAY_NAMES: Record<string, string> = {
    "01": "Andalucía", "02": "Aragón", "03": "Asturias", "04": "Illes Balears",
    "05": "Canarias", "06": "Cantabria", "07": "Castilla y León", "08": "Castilla-La Mancha",
    "09": "Cataluña", "10": "Comunidad Valenciana", "11": "Extremadura", "12": "Galicia",
    "13": "Madrid", "14": "Murcia", "15": "Navarra", "16": "País Vasco", "17": "La Rioja",
    "18": "Ceuta", "19": "Melilla"
};

interface SpainRegionsMapProps {
    valuesByRegion?: Record<string, number>;
    onRegionSelect?: (regionId: string, regionName: string) => void;
}

export const SpainRegionsMap: React.FC<SpainRegionsMapProps> = ({
    valuesByRegion = {},
    onRegionSelect,
}) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!chartRef.current) return;

        const root = am5.Root.new(chartRef.current);

        const chart = root.container.children.push(
            am5map.MapChart.new(root, {
                projection: am5map.geoMercator(),
                panX: "none",
                panY: "none",
                wheelX: "none",
                wheelY: "none",
                // Centramos más agresivamente en la península
                homeGeoPoint: { latitude: 34.5, longitude: -3 },
                homeZoomLevel: 2.1 // Zoom mucho más alto para que España se vea ENORME
            })
        );

        // Fondo Océano suave
        chart.chartContainer.set("background", am5.Rectangle.new(root, {
            fill: am5.color(0xdbeafe),
            fillOpacity: 3
        }));

        const polygonSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {
                valueField: 'value',
                calculateAggregates: true
            })
        );

        polygonSeries.mapPolygons.template.setAll({
            tooltipText: '{name}: [bold]{value}[/]',
            fill: am5.color(0x10b981),
            stroke: am5.color(0xffffff),
            strokeWidth: 0.8,
            interactive: true,
            cursorOverStyle: 'pointer'
        });

        polygonSeries.mapPolygons.template.states.create("hover", { fill: am5.color(0x059669) });

        polygonSeries.mapPolygons.template.events.on('click', (ev) => {
            const dataItem = ev.target.dataItem;
            if (dataItem) {
                const dataContext = dataItem.dataContext as any;
                const id = dataContext?.id as string;
                const name = (dataItem.dataContext as any).name as string;
                if (onRegionSelect) onRegionSelect(id, name);
            }
        });

        const loadData = async () => {
            try {
                const response = await fetch('/spain-ccaa.geojson');
                const geoData = await response.json();
                if (root.isDisposed()) return;

                geoData.features.forEach((f: any) => {
                    const code = f.properties.cod_ccaa;
                    f.id = code;
                    f.properties.name = CCAA_DISPLAY_NAMES[code] || f.properties.noml_ccaa;

                    // Canarias "05": Traslación radical para que queden pegadas a la península
                    if (code === "05") {
                        f.geometry.coordinates.forEach((polygon: any) => {
                            polygon.forEach((ring: any) => {
                                ring.forEach((coord: any) => {
                                    // Movemos Canarias drásticamente: ~ +15 Longitud y +9.5 Latitud
                                    // Esto las pone justo debajo de Portugal/Andalucía
                                    coord[0] += 13.5;
                                    coord[1] += 8.8;
                                });
                            });
                        });
                    }
                });

                polygonSeries.set("geoJSON", geoData);
                polygonSeries.data.setAll(geoData.features.map((f: any) => ({
                    id: f.id,
                    value: valuesByRegion[f.id] || 0
                })));

                // Recuadro para Canarias (ajustado para que sea discreto pero visible)
                const line = chart.children.push(am5.Line.new(root, {
                    stroke: am5.color(0x94a3b8),
                    strokeDasharray: [3, 3],
                    strokeWidth: 1,
                    points: [
                        { x: am5.percent(2), y: am5.percent(78) },
                        { x: am5.percent(30), y: am5.percent(78) },
                        { x: am5.percent(30), y: am5.percent(98) },
                        { x: am5.percent(2), y: am5.percent(98) },
                        { x: am5.percent(2), y: am5.percent(78) }
                    ]
                } as any));

                chart.appear(1000, 100);
            } catch (err) { console.error(err); }
        };

        loadData();
        return () => root.dispose();
    }, [valuesByRegion, onRegionSelect]);

    return (
        <div
            ref={chartRef}
            className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl transition-all"
            style={{ height: '700px' }} // Contenedor aún más alto
        />
    );
};
