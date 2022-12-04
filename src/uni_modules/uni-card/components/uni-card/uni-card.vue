<template>
	<view class="uni-card" :class="{ 'uni-card--full': isFull, 'uni-card--shadow': isShadow,'uni-card--border':border}"
		:style="{'margin':isFull?0:margin,'padding':spacing,'box-shadow':isShadow?shadow:''}">
		<!-- 封面 -->
		<slot name="cover">
			<view v-if="cover" class="uni-card__cover">
				<image class="uni-card__cover-image" mode="widthFix" @click="onClick('cover')" :src="cover"></image>
			</view>
		</slot>
		<slot name="title">
			<view v-if="title || extra" class="uni-card__header">
				<!-- 卡片标题 -->
				<view class="uni-card__header-box" @click="onClick('title')">
					<view v-if="thumbnail" class="uni-card__header-avatar">
						<image class="uni-card__header-avatar-image" :src="thumbnail" mode="aspectFit" />
					</view>
					<view class="uni-card__header-content">
						<text class="uni-card__header-content-title uni-ellipsis">{{ title }}</text>
						<text v-if="title&&subTitle"
							class="uni-card__header-content-subtitle uni-ellipsis">{{ subTitle }}</text>
					</view>
				</view>
				<view class="uni-card__header-extra" @click="onClick('extra')">
					<text class="uni-card__header-extra-text">{{ extra }}</text>
				</view>
			</view>
		</slot>
		<!-- 卡片内容 -->
		<view class="uni-card__content" :style="{padding:padding}" @click="onClick('content')">
			<slot></slot>
		</view>
		<view class="uni-card__actions" @click="onClick('actions')">
			<slot name="actions"></slot>
		</view>
	</view>
</template>

<script>
	/**
	 * Card 卡片
	 * @description 卡片视图组件
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=22
	 * @property {String} title 标题文字
	 * @property {String} subTitle 副标题
	 * @property {Number} padding 内容内边距
	 * @property {Number} margin 卡片外边距
	 * @property {Number} spacing 卡片内边距
	 * @property {String} extra 标题额外信息
	 * @property {String} cover 封面图（本地路径需要引入）
	 * @property {String} thumbnail 标题左侧缩略图
	 * @property {Boolean} is-full = [true | false] 卡片内容是否通栏，为 true 时将去除padding值
	 * @property {Boolean} is-shadow = [true | false] 卡片内容是否开启阴影
	 * @property {String} shadow 卡片阴影
	 * @property {Boolean} border 卡片边框
	 * @event {Function} click 点击 Card 触发事件
	 */
	export default {
		name: 'UniCard',
		emits: ['click'],
		props: {
			title: {
				type: String,
				default: ''
			},
			subTitle: {
				type: String,
				default: ''
			},
			padding: {
				type: String,
				default: '10px'
			},
			margin: {
				type: String,
				default: '15px'
			},
			spacing: {
				type: String,
				default: '0 10px'
			},
			extra: {
				type: String,
				default: ''
			},
			cover: {
				type: String,
				default: ''
			},
			thumbnail: {
				type: String,
				default: ''
			},
			isFull: {
				// 内容区域是否通栏
				type: Boolean,
				default: false
			},
			isShadow: {
				// 是否开启阴影
				type: Boolean,
				default: true
			},
			shadow: {
				type: String,
				default: '0px 0px 3px 1px rgba(0, 0, 0, 0.08)'
			},
			border: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			onClick(type) {
				this.$emit('click', type)
			}
		}
	}
</script>

<style lang="scss" src="./uni-card.scss"></style>
