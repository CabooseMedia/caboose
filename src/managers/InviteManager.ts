import { EmailManager, Manager } from '@caboose/managers';
import logger from "@logger";
import { PrismaClient } from '@prisma/client'
import jsonwebtoken from 'jsonwebtoken';
import ShortUniqueId from 'short-unique-id';

import { execSync, exec } from 'child_process';

export class InviteManager extends Manager {

    protected prisma!: PrismaClient;
    protected emailManager!: EmailManager

    public async onStart(): Promise<void> {
        this.prisma = this.caboose.getDatabaseManager().getPrismaClient();
        this.emailManager = this.caboose.getEmailManager();
        let userCount = await this.prisma.user.count();
        if (userCount === 0) {
            let currentCodes = (await this.prisma.invite.findMany({
                where: {
                    email: null
                },
                select: {
                    code: true
                }
            })).map((invite) => {
                return invite.code;
            });
            if (currentCodes.length === 0) {
                await this.createInvite();
            } else {
                logger.info(`Invite code: ${currentCodes[0]}`);
            }
            logger.info(`The first user to sign up with the code will be the owner.`);
            logger.info(`Before allowing remote access, make sure to claim the owner account.`);
        }
    }

    public async createInvite(email: string | null = null): Promise<void> {
        if (email !== null) {
            let existingInvite = await this.prisma.invite.findUnique({
                where: {
                    email: email
                }
            });
            if (existingInvite) {
                logger.error(`Invite code already exists for email ${email}.`);
                return;
            }
        }
        let currentCodes = (await this.prisma.invite.findMany({
            select: {
                code: true
            }
        })).map((invite) => {
            return invite.code;
        });
        const uid = new ShortUniqueId({
            length: 8,
            dictionary: 'alphanum_upper'
        });
        let code;
        do {
            code = uid.rnd();
        } while (currentCodes.includes(code));
        await this.prisma.invite.create({
            data: {
                email: email,
                code: code
            }
        });
        if (email === null) {
            logger.info(`Created invite code ${code} for any email.`);
        } else {
            logger.info(`Created invite code ${code} for email ${email}.`);
            this.emailManager.sendInviteEmail(email, code);
        }
    }

}