import MenuItem from "@/components/ui/Menu/MenuItem";
import { useState } from "react";
import { Link } from "react-router-dom";

const RecursiveMenu = ({
    options,
    depth = 0,
    expandedItems,
    toggleExpand,
}: {
    options: any[]
    depth?: number
    expandedItems: string[]
    toggleExpand: (value: string) => void
}) => {
    return (
        <>
            {options.map((menu) => {
                const hasChildren = Array.isArray(menu.children) && menu.children.length > 0;
                const isExpanded = expandedItems.includes(menu.value);

                return (
                    <>
                        <MenuItem
                            key={menu.value}
                            eventKey={menu.value}
                            className={`flex justify-between items-center ${menu.isActive ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                            style={{ paddingLeft: `${depth * 16}px` }}
                        >
                            {hasChildren ? (
                                <span
                                    className="ml-2 w-full cursor-pointer flex justify-between items-center"
                                    onClick={() => toggleExpand(menu.value)}
                                >
                                    {menu.label}
                                    <span className="text-xs text-gray-400">
                                        {isExpanded ? "▾" : "▸"}
                                    </span>
                                </span>
                            ) : menu.target === "_blank" ? (
                                <a href={menu.href} target="_blank" rel="noopener noreferrer" className="ml-2 block w-full h-full">
                                    {menu.label}
                                </a>
                            ) : menu.onClick ? (
                                <div className="ml-2 w-full h-full cursor-pointer" onClick={(e) => {
                                    e.stopPropagation();
                                    menu.onClick?.();
                                }}>
                                    {menu.label}
                                </div>
                            ) : (
                                <Link to={menu.href || "#"} className="ml-2 block w-full h-full">
                                    {menu.label}
                                </Link>
                            )}
                        </MenuItem>

                        {hasChildren && isExpanded && (
                            <div className="ml-4">
                                <RecursiveMenu
                                    options={menu.children}
                                    depth={depth + 1}
                                    expandedItems={expandedItems}
                                    toggleExpand={toggleExpand}
                                />
                            </div>
                        )}
                    </>

                )
            })}
        </>
    )
}

export default RecursiveMenu
