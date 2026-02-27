// nav.data.ts
export interface NavLeaf {
  link: string;
  label: string;
}

export interface NavItem extends NavLeaf {
  children?: NavLeaf[];
}

export interface NavGroup {
  group: string;
  icon: string;
  items: NavItem[];
}

export const navJsonObject: ReadonlyArray<NavGroup> = [
  // {
  //   group: "HR Dashboard",
  //   icon: "dashboard",
  //   items: [
  //     { link: "/dashboard", label: "Overview" },
  //     { link: "/analytics", label: "Analytics" }
  //   ]
  // },

  {
    group: "Employee Management",
    icon: "users",
    items: [
      {
        link: "/employee",
        label: "Employee",
        children: [
          { link: "/employee/list", label: "Employee List" },
          { link: "/employee/add", label: "Add Employee" },
          // { link: "/employee/documents", label: "Documents" },
          { link: "/employee/profile", label: "My Profile" }
        ]
      }
    ]
  },

  {
    group: "Attendance & Leave",
    icon: "calendar",
    items: [
      // {
      //   link: "/attendance",
      //   label: "Attendance",
      //   children: [
      //     { link: "/attendance/logs", label: "Daily Logs" },
      //     { link: "/attendance/summary", label: "Summary" }
      //   ]
      // },
      {
        link: "/leave",
        label: "Leave Management",
        children: [
          // { link: "/holidays", label: "Holidays" },
          { link: "/leave/apply", label: "Apply Leave" },
          { link: "/leave/history", label: "Leave History" },
          { link: "/leave/approval", label: "Approvals" }
        ]
      }
    ]
  },

  // {
  //   group: "Payroll",
  //   icon: "money",
  //   items: [
  //     {
  //       link: "/salary",
  //       label: "Salary",
  //       children: [
  //         { link: "/salary/list", label: "Salary List" },
  //         { link: "/salary/slip", label: "Salary Slips" },
  //         { link: "/salary/structure", label: "Salary Structure" }
  //       ]
  //     }
  //   ]
  // },

  // {
  //   group: "Recruitment",
  //   icon: "briefcase",
  //   items: [
  //     {
  //       link: "/recruitment",
  //       label: "Hiring",
  //       children: [
  //         { link: "/recruitment/job-openings", label: "Job Openings" },
  //         { link: "/recruitment/candidates", label: "Candidates" },
  //         { link: "/recruitment/interviews", label: "Interviews" }
  //       ]
  //     }
  //   ]
  // },

  // {
  //   group: "Performance",
  //   icon: "star",
  //   items: [
  //     {
  //       link: "/performance",
  //       label: "Performance",
  //       children: [
  //         { link: "/performance/reviews", label: "Performance Reviews" },
  //         { link: "/performance/goals", label: "Goals & OKRs" }
  //       ]
  //     }
  //   ]
  // },

  // {
  //   group: "Admin / Settings",
  //   icon: "settings",
  //   items: [
  //     {
  //       link: "/admin",
  //       label: "Admin Panel",
  //       children: [
  //         { link: "/admin/users", label: "User Management" },
  //         { link: "/admin/roles", label: "Roles & Permissions" },
  //         { link: "/admin/departments", label: "Departments" }
  //       ]
  //     }
  //   ]
  // }
] as const;