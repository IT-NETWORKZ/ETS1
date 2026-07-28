import React from 'react'
import SubscriptionPlans from '../../../../components/SubscriptionPlans'
import DashboardLayout from '../../../../dashboard/DashboardLayout'
import { CANDIDATE_NAV } from '../candidateNav'

const PricingPlans = () => {
  return (
    <div>
      <DashboardLayout
        role="candidate"
        roleLabel="Candidate Dashboard"
        roleColor="var(--leaf-500)"
        navItems={CANDIDATE_NAV}
        userName="Amrapali Ambade"
        userMeta="Candidate · Master Plan"
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

export default PricingPlans