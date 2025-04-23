import Link from 'next/link'
import React from 'react'
import { PageContainer } from '@keystone-6/core/admin-ui/components'
import { Heading } from '@keystar/ui/typography'

export default function CustomPage () {
  return (
    <PageContainer header={<Heading type="h3">Custom Page</Heading>}>
      <h1
        style={{
          width: '100%',
          textAlign: 'center',
        }}
      >
        This is a custom Admin UI Page
      </h1>
      <p
        style={{
          textAlign: 'center',
        }}
      >
        It can be accessed via the route <Link href="/custom-page">/custom-page</Link>
      </p>
    </PageContainer>
  )
}