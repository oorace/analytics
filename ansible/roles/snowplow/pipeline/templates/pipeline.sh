#!/usr/bin/env bash
COLLECTOR_CMD="{{snowplow_stream_collector_file}} --config {{snowplow_stream_collector_installation_folder}}/collector.cfg"

ENRICH_CMD="{{snowplow_stream_enrich_file}} --config {{snowplow_stream_enrich_installation_folder}}/enrich.cfg \
    --resolver file:{{snowplow_stream_enrich_installation_folder}}/resolver.json \
    --enrichments file:{{snowplow_stream_enrich_installation_folder}}/enrichments"

PIPELINE_CMD="$COLLECTOR_CMD | $ENRICH_CMD"

eval $PIPELINE_CMD
