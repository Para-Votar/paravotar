import React from "react"
import { animated } from "react-spring"

type Props = {
  className: string
  style: {
    transform: string
  }
}

export default function Arrows(props: Props) {
  return (
    <animated.svg width="14" height="14" viewBox="0 0 14 14" {...props}>
      <path
        d="M12.691006,4.09811185 C12.5540131,3.95635807 12.3961801,3.84441381 12.2248623,3.76460462 L12.9239246,3.02644905 C13.2225303,2.72116574 13.3880251,2.31387466 13.3899832,1.87920535 C13.3919071,1.44252761 13.2286597,1.03206532 12.9302583,0.723293637 L12.691006,0.475620945 C12.3922981,0.166637865 11.9955193,-0.00217703358 11.5728946,2.12005747e-05 C11.1505764,0.00236839643 10.7552278,0.175728725 10.4597889,0.487988717 C10.4588695,0.489045779 10.4578479,0.490102868 10.4569285,0.491159956 L6.6780287,4.55011719 L2.93447531,0.594859024 C2.64026236,0.285770244 2.24746764,0.113784106 1.82821417,0.110507166 C1.40793915,0.107230254 1.01361204,0.272979641 0.71500634,0.577417291 L0.467990033,0.829212583 C0.165298017,1.13777283 -0.000911857226,1.54992645 3.76289366e-06,1.98956399 C0.000926971132,2.42835591 0.168158447,2.8387125 0.470850437,3.14568713 L1.12332897,3.81819834 C0.974587973,3.89409635 0.836675663,3.99462418 0.71500634,4.11861909 L0.467990033,4.37041441 C0.165298017,4.67897466 -0.000911857226,5.09112825 3.76289366e-06,5.53087152 C0.000926971132,5.9706148 0.168873528,6.38192275 0.472178501,6.68826315 L5.6060924,11.8980581 C5.90102047,12.1960476 6.29034185,12.36 6.70244429,12.36 L6.70458961,12.36 C7.11750931,12.3594714 7.50713718,12.1943563 7.80175873,11.8949926 C7.80390406,11.8928785 7.8059472,11.8907643 7.80799035,11.8886502 L9.34239264,10.2771391 C9.54517483,10.0641384 9.54272305,9.72143464 9.33687613,9.51160523 C9.13113139,9.30188151 8.79993749,9.30441849 8.5971553,9.51731342 L7.06643067,11.1250191 C6.86467005,11.3271318 6.53827754,11.326709 6.33784498,11.1242791 L1.2038289,5.91458983 C1.10248888,5.81215925 1.0465067,5.67505661 1.04620022,5.52844027 C1.04589376,5.38182394 1.101263,5.24450987 1.20219438,5.14165646 L1.44921067,4.88986114 C1.54871187,4.78838192 1.68090339,4.73277978 1.82024589,4.73425967 C1.91749962,4.73499963 2.01025845,4.76354068 2.09086054,4.81523165 L5.60241474,8.43423421 L5.6060924,8.43803968 C5.89509533,8.72989813 6.28002395,8.8924763 6.69018542,8.89585894 L6.70305725,8.89585894 C7.11914383,8.89585894 7.50887384,8.73254081 7.80175873,8.43497417 C7.80421051,8.43254289 7.80656013,8.43011161 7.80901191,8.42757463 L11.0954115,4.95719685 C11.1355593,4.93320124 11.1734597,4.90370883 11.207478,4.86766257 C11.3059576,4.76354068 11.4377405,4.70582436 11.5785133,4.70508443 C11.7200011,4.70413304 11.8516818,4.76058087 11.951183,4.86353997 L12.1905375,5.11121269 C12.2900387,5.21417183 12.3444885,5.35095734 12.3437734,5.49651659 C12.3431605,5.64207586 12.2874848,5.77833284 12.1862469,5.88129195 L10.4855325,7.61743222 C10.27989,7.82736736 10.2776425,8.17007112 10.4805268,8.38286037 C10.5828884,8.49025921 10.7178382,8.5439586 10.8529923,8.5439586 C10.9855924,8.5439586 11.1183969,8.49205623 11.2202477,8.38804003 L12.9200426,6.65285113 C13.2211001,6.34703929 13.3880251,5.93816261 13.3899832,5.50159055 C13.3919071,5.06501852 13.2286597,4.65445052 12.9302583,4.34567887 L12.691006,4.09811185 Z M7.06591989,7.66542344 C6.9692791,7.7619344 6.83964152,7.81457676 6.698358,7.81333064 C6.56064999,7.81214548 6.43295341,7.75950312 6.33856009,7.66500061 L3.0057811,4.23024623 C2.9856561,4.19694838 2.96215994,4.16523613 2.93447531,4.13616655 C2.88063845,4.07950733 2.8233282,4.02771066 2.76336187,3.98045939 L1.20750656,2.37708777 C1.20628068,2.37581928 1.20505479,2.37455079 1.2038289,2.3732823 C1.10248888,2.27085169 1.0465067,2.13374905 1.04619895,1.98723844 C1.04589376,1.84062211 1.101263,1.70330804 1.20219438,1.60045463 L1.44921067,1.34865934 C1.54871187,1.24718012 1.68100554,1.19178935 1.82024589,1.19305787 C1.95999705,1.19411493 2.09096269,1.25140842 2.18801209,1.35341617 L6.30740212,5.70571177 C6.40639252,5.8102565 6.54256816,5.86934701 6.6833409,5.86818422 C6.82462439,5.86765569 6.95977848,5.80782525 7.05784946,5.70254053 L11.2088061,1.24390318 C11.3071835,1.14062694 11.4383535,1.08343916 11.5785133,1.08259112 C11.7194903,1.08217067 11.8516818,1.13808996 11.951183,1.24115477 L12.1905375,1.48882749 C12.2900387,1.5916809 12.3444885,1.72857214 12.3437804,1.87413139 C12.3431605,2.01969063 12.2874848,2.15594764 12.1871663,2.25784969 C12.1847145,2.26028097 12.1823649,2.26281795 12.1800153,2.2652492 L7.06591989,7.66542344 Z"
        transform="translate(.2 .792)"
        stroke="none"
      />
    </animated.svg>
  )
}