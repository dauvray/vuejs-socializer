import CustomViews from '~/socializer_custom_elements/views'
import NetworksList from 'vuejs-socializer/components/widgets/network/Networks'
import Network from 'vuejs-socializer/components/widgets/network/Network'
import Room from 'vuejs-socializer/components/widgets/network/rooms/Room'
import Welcome from 'vuejs-socializer/components/widgets/network/widgets/Welcome'

export default [
    {
        path: `/${router_base_url}/networks`,
        component: CustomViews.Networks,
        children: [
            {
                path: '',
                name: 'networks',
                component: NetworksList,
                meta: {
                    breadcrumb: [
                        {name: 'Accueil', link: `/${router_base_url}`},
                        {name: 'Networks', link: null},
                    ],
                },
            },
        ]
    },
    {
        path: `/${router_base_url}/network/:networkSlug`,
        component: Network,
        meta: {
            breadcrumb: [
                {name: 'Accueil', link: `/${router_base_url}`},
                {name: 'Networks', link: null},
                {name: 'Network', link: null}
            ],
        },
        children: [
            {
                path: '',
                name: 'network',
                component: Welcome,
                meta: {
                    breadcrumb: [
                        {name: 'Accueil', link: `/${router_base_url}`},
                        {name: 'Networks', link: null},
                        {name: 'Network', link: null},
                    ],
                },
            },
            {
                path: 'room/:roomId',
                name: 'room',
                component: Room,
                meta: {
                    breadcrumb: [
                        {name: 'Accueil', link: `/${router_base_url}`},
                        {name: 'Networks', link: null},
                        {name: 'Network', link: null},
                        {name: 'Room', link: null}
                    ],
                },
            },
        ]
    }
]
