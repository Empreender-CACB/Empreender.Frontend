import React from 'react'
import { Link } from 'react-router-dom'
import { HiChevronRight } from 'react-icons/hi'

const Breadcrumb = ({ items } : any) => {
    return (
        <nav className="breadcrumb py-2 mb-4">
            <ol className="flex space-x-2 text-sm text-gray-700">
                {items.map((item: any, index: any) => (
                    <li key={index} className="flex items-center">
                        {item.link ? (
                            <Link to={item.link} className="hover:underline text-blue-500">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-gray-500">{item.label}</span>
                        )}
                        {index < items.length - 1 && (
                            <span className="mx-2"><HiChevronRight /></span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}

export default Breadcrumb
