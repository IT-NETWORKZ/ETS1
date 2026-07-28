import React from 'react'
import DashboardLayout from '../../../../dashboard/DashboardLayout'
import SubscriptionPlans from '../../../../components/SubscriptionPlans'
import { ADMIN_NAV } from '../adminNav'
export const AdminSubscription = () => {
    return (
        <div>
            <DashboardLayout
                role="admin"
                roleLabel="Admin Dashboard"
                roleColor="#2f7dd1"
                navItems={ADMIN_NAV}
                userName="Admin"
                userMeta="Organisation Admin"
            >


                <SubscriptionPlans
                    showHero={false}
                    showStats={false}
                    showHighlight={false}
                />
            </DashboardLayout>
        </div>
    )
}
