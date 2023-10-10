import { Badge, Card } from '@/components/ui'
import React from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const geoUrl =
    'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson'

const MapHeat = () => {
    const getColor = (value) => {
        if (value > 90) return '#006400' // DarkGreen
        if (value > 80) return '#008000' // Green (Web color)
        if (value > 70) return '#228B22' // ForestGreen
        if (value > 60) return '#32CD32' // LimeGreen
        if (value > 50) return '#3CB371' // MediumSeaGreen
        if (value > 40) return '#66CDAA' // MediumAquamarine
        if (value > 30) return '#98FB98' // PaleGreen
        if (value > 20) return '#ADFF2F' // GreenYellow
        if (value > 10) return '#F0FFF0' // Honeydew
        return '#FFFFFF' // Branco
    }

    const data = {
        AC: 85,
        AL: 62,
        AP: 48,
        AM: 73,
        BA: 54,
        CE: 39,
        DF: 66,
        ES: 91,
        GO: 52,
        MA: 77,
        MT: 43,
        MS: 69,
        MG: 88,
        PA: 36,
        PB: 100,
        PR: 47,
        PE: 59,
        PI: 81,
        RJ: 100,
        RN: 74,
        RS: 95,
        RO: 41,
        RR: 63,
        SC: 29,
        SP: 86,
        SE: 50,
        TO: 94,
    }

    const regionsData = [
        { name: 'Norte', value: 20 },
        { name: 'Nordeste', value: 25 },
        { name: 'Centro-Oeste', value: 15 },
        { name: 'Sudeste', value: 30 },
        { name: 'Sul', value: 10 },
    ]

    return (
        <Card>
            <h4>Participação do Empreender</h4>
            <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 px-4">
                    <ComposableMap
                        projectionConfig={{ scale: 700, center: [-38, -15] }}
                    >
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    const cur = data[geo.properties.sigla]
                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={cur ? getColor(cur) : '#EEE'}
                                        />
                                    )
                                })
                            }
                        </Geographies>
                    </ComposableMap>
                </div>
                <div className="flex flex-col justify-center px-4">
                    {regionsData.map((region, index) => (
                        <div
                            key={region.name}
                            className="mb-6 flex justify-between"
                        >
                            {/* Supondo que você tenha um componente Badge ou pode substituir por um <span> ou <div> */}
                            <Badge
                                innerClass={`color-class-for-${region.name}`}
                            />
                            <div className="font-semibold">{region.name}</div>
                            <div>{region.value}%</div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}

export default MapHeat
