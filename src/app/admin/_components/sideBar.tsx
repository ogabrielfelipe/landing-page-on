'use client'

import { BarChart, ChevronRight, ChevronLeft, Layers, Settings, Users } from "lucide-react";

import Link from 'next/link'

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SideBar() {
    const [sidebarExpanded, setSidebarExpanded] = useState(false)    

    return (
        <aside className={`bg-blue-800 text-blue-100 ${sidebarExpanded ? 'w-64' : 'w-20'} space-y-6 py-7 px-2 mb-4 absolute inset-y-0 left-0 transform ${sidebarExpanded ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
        <nav>
          <Button variant="ghost" className={`w-full justify-start text-blue-100 hover:bg-blue-700 hover:text-white ${!sidebarExpanded && 'justify-center'}`} asChild>
            <Link href="/admin">
              <BarChart className="h-5 w-5" />
              {sidebarExpanded && <span className="ml-3">Dashboard</span>}
            </Link>
          </Button>
          <Button variant="ghost" className={`w-full justify-start text-blue-100 hover:bg-blue-700 hover:text-white ${!sidebarExpanded && 'justify-center'}`} asChild>
            <Link href="/admin/users">
              <Users className="h-5 w-5" />
              {sidebarExpanded && <span className="ml-3">Users</span>}
            </Link>
          </Button>
          <Button variant="ghost" className={`w-full justify-start text-blue-100 hover:bg-blue-700 hover:text-white ${!sidebarExpanded && 'justify-center'}`} asChild>
            <Link href="/admin/content">
              <Layers className="h-5 w-5" />
              {sidebarExpanded && <span className="ml-3">Content</span>}
            </Link>
          </Button>
          <Button variant="ghost" className={`w-full justify-start text-blue-100 hover:bg-blue-700 hover:text-white ${!sidebarExpanded && 'justify-center'}`} asChild>
            <Link href="/admin/settings">
              <Settings className="h-5 w-5" />
              {sidebarExpanded && <span className="ml-3">Settings</span>}
            </Link>
          </Button>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Button
            variant="ghost"
            className="w-full justify-center text-blue-100 hover:bg-blue-700 hover:text-white"
            onClick={() =>{ setSidebarExpanded(!sidebarExpanded); console.log(!sidebarExpanded)}}
          >
            {sidebarExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>
      </aside>
    )
}