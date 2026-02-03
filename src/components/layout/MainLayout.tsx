import React, { ReactNode } from "react";

interface MainLayoutProps {
    leftPanel: ReactNode;
    rightPanel: ReactNode;
}

export function MainLayout({ leftPanel, rightPanel }: MainLayoutProps) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            {/* Left Column: 60-70% */}
            <div className="flex-[2] flex flex-col border-r border-border min-w-0">
                {leftPanel}
            </div>

            {/* Right Column: 30-40% */}
            <div className="flex-1 flex flex-col min-w-[300px]">
                {rightPanel}
            </div>
        </div>
    );
}
