"use client";

import { useSearchParams } from "next/navigation";
import { FC } from "react";

import {
  ListPageTemplate,
  ListPageTemplateProps,
} from "@/components/templates/ListPage.template";

import {
  GarantiesFinancièresDépôtsEnCoursListItem,
  GarantiesFinancièresDépôtsEnCoursListItemProps,
} from "./GarantiesFinancièresListItem";

export type GarantiesFinancièresDépôtsEnCoursListProps = {
  list: {
    items: Array<GarantiesFinancièresDépôtsEnCoursListItemProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: ListPageTemplateProps<GarantiesFinancièresDépôtsEnCoursListItemProps>["filters"];
};

export const GarantiesFinancièresDépôtsEnCoursListPage: FC<
  GarantiesFinancièresDépôtsEnCoursListProps
> = ({
  list: { items: garantiesFinancières, currentPage, totalItems, itemsPerPage },
  filters,
}) => {
  const searchParams = useSearchParams();
  const appelOffre = searchParams.get("appelOffre") ?? undefined;

  const tagFilters = [
    ...(appelOffre
      ? [
          {
            label: `appel d'offres : ${appelOffre}`,
            searchParamKey: "appelOffre",
          },
        ]
      : []),
  ];

  return (
    <ListPageTemplate
      heading="Garanties financières en attente de validation"
      actions={[]}
      items={garantiesFinancières.map((gf) => ({
        ...gf,
        key: gf.identifiantProjet,
      }))}
      currentPage={currentPage}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      ItemComponent={GarantiesFinancièresDépôtsEnCoursListItem}
      tagFilters={tagFilters}
      filters={filters}
    />
  );
};
