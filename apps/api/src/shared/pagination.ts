import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { Page } from '@repo/common/types';

interface CountableCollection {
  count(parameters: { skip: number; take: number }): Promise<number>;
}

const FIRST_PAGE = 1;
const PAGE_SIZE = 10;
const PAGE_QUERY_PARAM = 'page';

function parseOptionalInt(value?: string): number | undefined {
  return value ? parseInt(value, 10) : undefined;
}

function urlWithoutQueryParameters(request: Request): string {
  const protocolAndHost = `${request.protocol}://${request.get('Host')}`;
  const pathname = new URL(`${protocolAndHost}${request.originalUrl}`).pathname;
  return `${protocolAndHost}${pathname}`;
}

export function getPage(pageNum?: number): Page {
  return {
    num: Math.min(Math.max(pageNum ?? 0, FIRST_PAGE)),
    size: PAGE_SIZE,
  };
}

export function nextLink(parameters: {
  nextPage?: Page;
  request: Request;
}): string | undefined {
  const { nextPage, request } = parameters;
  return nextPage
    ? `${urlWithoutQueryParameters(request)}?${PAGE_QUERY_PARAM}=${nextPage.num}`
    : undefined;
}

export function queryParameters(parameters: { page: Page }): {
  skip: number;
  take: number;
} {
  const { page } = parameters;
  return {
    take: page.size,
    skip: (page.num - 1) * page.size,
  };
}

async function countOnPage(
  page: Page,
  collection: CountableCollection,
): Promise<number> {
  return collection.count(queryParameters({ page }));
}

export async function getNextPage(parameters: {
  currentPage: Page;
  collection: CountableCollection;
}): Promise<Page | undefined> {
  const { currentPage, collection } = parameters;
  const nextPageNum = currentPage.num + 1;
  const nextPage = getPage(nextPageNum);

  const countRemaining = await countOnPage(nextPage, collection);

  if (countRemaining > 0) {
    return nextPage;
  }

  return undefined;
}

// NestJS Decorator
export const PaginationPage = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const page = parseOptionalInt(request.query[PAGE_QUERY_PARAM] as string);

    return getPage(page);
  },
);
