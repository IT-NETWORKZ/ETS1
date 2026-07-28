import React from 'react'
import SubscriptionPlans from '../../../../components/SubscriptionPlans'
import DashboardLayout from '../../../../dashboard/DashboardLayout'
import { SUPERADMIN_NAV } from "../superadminNav";

const SubscriptionPlans_SA = () => {
    return (
        <div>

            <DashboardLayout
                role="superadmin" roleLabel="Superadmin Console" roleColor="#7c5cff"
                navItems={SUPERADMIN_NAV} userName="R. Kulkarni" userMeta="Superadmin · Full Access"
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

export default SubscriptionPlans_SA