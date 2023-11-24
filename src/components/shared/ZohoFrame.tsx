// ZohoFrame.js
import React from 'react'

interface ZohoProps {
    url: string
}

const ZohoFrame = ({ url }: ZohoProps) => {
    return (
        <div className="content">
            <iframe
                width="100%"
                height="800"
                src={url}
                title="Zoho Analytics"
                style={{ border: 'none' }}
            ></iframe>
        </div>
    )
}

export default ZohoFrame
